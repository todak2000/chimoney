import { faker } from "@faker-js/faker";
import moment from "moment";

export const formatedDate = () => {
  const date = faker.date.birthdate();

  const options: any = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return formattedDate;
};

export const formatedDatePast = () => {
  const date = faker.date.past();
  const formattedDate = moment(date).format("MMM DD YYYY");
  return formattedDate;
};
