import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth, db, provider } from "@/firebase";
import { httpRequest } from "@/app/lib/httpRequest";
import { Dispatch } from "react";
import { setIsLoading } from "@/app/store";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import { ISignup, OnboardingProps } from "@/app/constants/types";

export const baseURL = `${process.env.NEXT_PUBLIC_CHIMONEY_URL}/v0.2`;

// create chimoney sub-account
const createAccount = async (data: ISignup) => {
  return httpRequest(`${baseURL}/sub-account/create`, "POST", data);
};

// get user chimoney sub-account ID
export const getAccountId = async (
  uid: string
): Promise<{ accountNo: string; phone: string } | null> => {
  try {
    const userRef = doc(db, "Users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        accountNo: userData?.accountId || null,
        phone: userData?.phoneNumber || null,
      };
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
export const handleFBUser = async (data: any) => {
  try {
    const userRef = doc(db, "Users", data?.meta?.userId);

    // Check if user exists
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return {
        status: 200,
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
        status: 200,
        user: newUser,
      };
    }
  } catch (err: any) {
    return {
      status: 405,
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

    if (!userAuthRes) {
      throw new Error("Failed to create account");
    }

    await handleFBUser({
      ...userData,
      accountId: userAuthRes.status === "success" ? userAuthRes?.data?.id : "",
    });
    const message =
      userAuthRes.status === "error"
        ? `Welcome back, ${res?.user?.displayName}! your login was successful`
        : `${res?.user?.displayName}! your registration was successful. You will be redirected shortly`;

    dispatch(setIsLoading(false));
    return {
      status: 200,
      message: message,
    };
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

// Update User Phone Number
export const handlePhoneNumber = async (data: {
  userId: string;
  phone: string;
}) => {
  try {
    const userRef = doc(db, "Users", data?.userId);

    await setDoc(userRef, { phoneNumber: data.phone }, { merge: true });
    return {
      status: 200,
      phone: data.phone,
    };
  } catch (err: any) {
    return {
      status: 405,
      message: err?.message,
    };
  }
};

// Remove user from FB
export const handleDeleteUser = async (userId: string) => {
  try {
    const userRef = doc(db, "Users", userId);

    await deleteDoc(userRef);
    await deleteUser(auth.currentUser as User);

    return {
      status: 200,
      message: "Account successfully deleted",
    };
  } catch (err: any) {
    console.error(err); // Log the error for debugging purposes

    return {
      status: err.code || 500,
      message: err.message || "An unknown error occurred",
    };
  }
};

export const getAccountNumberByEmail = async (email: string) => {
  try {
    const usersCollection = collection(db, "Users");
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No user found with the provided email.");
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    const accountNo = userDoc.data().accountId;
    const name = userDoc.data().name;

    return { accountNo, name };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const handleEmailAuth = async (
  dispatch: Dispatch<any>,
  data: OnboardingProps,
  type: string
) => {
  try {
    dispatch(setIsLoading(true));
    let res: any;
    let update: any;
    let userAuthRes: any;
    let userData: ISignup;

    if (type === "signup") {
      res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      update = await updateProfile(res.user, { displayName: data.name });
      userData = {
        name: res?.user?.displayName as string,
        email: res?.user?.email as string,
        firstName: res?.user?.displayName.split(" ")[0],
        lastName:
          res?.user?.displayName.split(" ")[1] ??
          res?.user?.displayName.split(" ")[0],
        meta: {
          userId: res?.user?.uid, //google uid
          photo: res?.user?.photoURL ?? "",
        },
      };
      userAuthRes = await createAccount(userData);
      await handleFBUser({
        ...userData,
        accountId:
          userAuthRes.status === "success" ? userAuthRes?.data?.id : "",
      });
      if (!userAuthRes) {
        throw new Error("Failed to create account");
      }
    } else {
      res = await signInWithEmailAndPassword(auth, data.email, data.password);
    }

    const message =
      userAuthRes && userAuthRes.status === "error"
        ? `Welcome back, ${res?.user?.displayName}! your login was successful`
        : `${res?.user?.displayName}! your registration was successful. You will be redirected shortly`;

    dispatch(setIsLoading(false));
    return {
      status: 200,
      message: message,
    };
  } catch (error: any) {
    console.log(error.message, "auth error---");
    let status: number;
    let message: string;
    dispatch(setIsLoading(false));
    switch (error.message) {
      case "Firebase: Error (auth/user-not-found).":
        status = 404;
        message = "Email does not exist in our Database. Please register 😞";
        break;
      case "Firebase: Error (auth/invalid-credential).":
        status = 401;
        message = "Invalid credentials (Email/password is incorrect)! 😞";
        break;
      case "Firebase: Error (auth/email-already-exists).":
        status = 409;
        message = "Email already exists, please try another email! 😞";
        break;
      case "Firebase: Error (auth/email-already-in-use).":
        status = 408;
        message = "Email already exists, please try another email! 😞";
        break;
      default:
        status = 500;
        message = "Oops, something went wrong! 😞";
        break;
    }

    return {
      status,
      message,
      error: error?.message,
    };
  }
};

export const handleEmailRegister = async (
  dispatch: Dispatch<any>,
  data: OnboardingProps
) => {
  try {
    dispatch(setIsLoading(true));
    let userAuthRes: any;

    const res = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    if (res && res?.user) {
      const update = await updateProfile(res.user, { displayName: data.name });
      const userData = {
        name: res?.user?.displayName as string,
        email: res?.user?.email as string,
        firstName: data.name ? data?.name?.split(" ")[0] : "",
        lastName: data.name ? data?.name?.split(" ")[1] : "",
        meta: {
          userId: res?.user?.uid, //google uid
          photo: res?.user?.photoURL ?? "",
        },
      };
      userAuthRes = await createAccount(userData);
      await handleFBUser({
        ...userData,
        accountId:
          userAuthRes.status === "success" ? userAuthRes?.data?.id : "",
      });
      if (!userAuthRes) {
        throw new Error("Failed to create account");
      }
    }
    const message =
      userAuthRes && userAuthRes.status === "success"
        ? `${data.name}! your registration was successful. You will be redirected shortly`
        : "";

    dispatch(setIsLoading(false));
    return {
      status: 200,
      message: message,
    };
  } catch (error: any) {
    console.log(error.message, "auth error---");
    let status: number;
    let message: string;
    dispatch(setIsLoading(false));

    switch (error.code) {
      case "auth/email-already-in-use":
        status = 409;
        message = `${data.name}! your registration was successful. You will be redirected shortly`;
        break;
      case "auth/invalid-email":
        status = 400;
        message = "The email address is not valid. 😞";
        break;
      case "auth/operation-not-allowed":
        status = 403;
        message = "Email/password accounts are not enabled. 😞";
        break;
      case "auth/weak-password":
        status = 422;
        message = "The password is not strong enough. 😞";
        break;
      default:
        status = 500;
        message = "Oops, something went wrong! 😞";
    }

    return {
      status,
      message,
      error: error?.message,
    };
  }
};
