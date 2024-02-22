import { signInWithPopup, signOut } from "firebase/auth";

import { auth, db, provider } from "@/firebase";
import { httpRequest } from "@/app/lib/httpRequest";
import { Dispatch } from "react";
import { setIsLoading, setUser } from "@/app/store";
import { doc, getDoc, setDoc } from "@firebase/firestore";
export const baseURL = `${process.env.NEXT_PUBLIC_CHIMONEY_URL}/v0.2`;

type ISignup = {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  meta: {
    userId: string; //google uid
  };
};

// create chimoney sub-account
const createAccount = async (data: ISignup) => {
  return httpRequest(`${baseURL}/sub-account/create`, "POST", data);
};

// get user chimoney sub-account ID
export const getAccountId = async (uid: string): Promise<string | null> => {
  try {
    const userRef = doc(db, "Users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData?.accountId || null;
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data: ", error);
    return null;
  }
};
// create New Firebase user
export const handleFBUser = async (dispatch: Dispatch<any>, data: any) => {
  try {
    const userRef = doc(db, "Users", data?.meta?.userId);

    // Check if user exists
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return {
        statusCode: 200,
        user: docSnap.data(),
      };
    } else {
      // User does not exist, create new user
      const newUser = {
        id: data?.meta?.userId,
        photo: data?.meta?.photo,
        ...data,
      };

      await setDoc(userRef, newUser, { merge: true });
      return {
        statusCode: 200,
        user: newUser,
      };
    }
  } catch (err: any) {
    return {
      statusCode: 405,
      message: err?.message,
    };
  }
};

export const handleGoogleAuth = async (dispatch: Dispatch<any>) => {
  try {
    dispatch(setIsLoading(true));
    const res: any = await signInWithPopup(auth, provider);

    const userData = {
      name: res?.user?.displayName as string,
      email: res?.user?.email as string,
      firstName: res?.user?.displayName.split(" ")[0],
      lastName:
        res?.user?.displayName.split(" ")[1] ??
        res?.user?.displayName.split(" ")[0],
      meta: {
        userId: res?.user?.uid, //google uid
        photo: res?.user?.photoURL,
      },
    };
    const userAuthRes = await createAccount(userData);

    if (userAuthRes) {
      await handleFBUser(dispatch, {
        ...userData,
        accountId:
          userAuthRes.status === "success" ? userAuthRes?.data?.id : "",
      });
      const message =
        userAuthRes.status === "error"
          ? `Welcome back, ${res?.user?.displayName}! your login was successful`
          : `${res?.user?.displayName}! your registration was successful`;

      return {
        status: 200,
        message: message,
      };
    }
    dispatch(setIsLoading(false));
    return {};
  } catch (err: any) {
    dispatch(setIsLoading(false));
    return {
      status: 501,
      message: "Oops, something went wrong! 😞",
      error: err?.message,
    };
  }
};

// User Signout API
export const handleGoogleSignOut = async () => {
  try {
    await signOut(auth);
    return {
      status: 200,
      message: "Success!",
    };
  } catch (error: any) {
    return {
      status: 405,
      message: error?.message,
    };
  }
};
