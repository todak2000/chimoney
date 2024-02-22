# Chimoney

    "A streamlined app that allows users to securely create and manage their accounts, send and receive payments, and view their transaction history, all integrated with Chimoney’s API and deployed live for easy access",

## LightHouse Score

## URL

https://chimoney.vercel.app

## Built with

- ⚡️ Next.js 13
- ⚛️ React 18
- ✨ TypeScript
- 💨 Tailwind CSS 3
- ✨ Redux toolkit
- ✨ React Query
- ✨ React-Redux
- ✨ Tremor React Library
- 🃏 Jest — Configured for unit testing

## Screens/Pages

This project showcases a personal finance dashboard application built using modern web technologies and integrated with Chimoney's API. It allows users to manage their finances, track transactions, and send/receive payments seamlessly.Users can:

- Toggle between light `☀️` and dark `🌙` mode using their respective buttons on the sidebar
- View User profile Page
- Switch between USD and NGN with live interative Chart and updated Transaction

## Features

This project implements the following features:

- User Authentication: Secure login and signup using Firebase Authentication, ensuring safe and reliable user data management.
- Dashboard: A comprehensive overview of your account balance, recent transactions, and essential actions like sending and receiving payments.
- Send Payment: Easily send money to other users or non-users through convenient search options by account ID, email, or phone number.
- Receive Payment: Receive payments directly into your account from other users or via email/phone, powered by Chimoney's technology.
- Transaction History: Track all financial activity with a detailed history page, including transaction date, type, amount, and sender/recipient information. Data retrieved through Chimoney's API and presented in a user-friendly table format.
- Security: Top priority is given to secure data storage and handling. Passwords and payment information are encrypted and protected against common vulnerabilities like XSS and CSRF attacks.
- API Integration: Seamless connection with Chimoney's API enables smooth payment processing and data retrieval, following their API documentation for authentication and endpoint usage.
- CI/CD: Continuous integration and deployment are established using available tools, guaranteeing automated build and deployment processes for efficient updates.

## Getting Started

To run this project locally, you will need to have Node.js, preferably version 20, npm, and TypeScript installed on your machine.

## Installation

Clone this repository to your local machine:

```
git clone https://github.com/todak2000/chimoney.git

```

Navigate to the project directory and install the dependencies:

```
cd chimoney
yarn install
```

## Development

Jest was used to implement unit Tests. see `__tests__` to run full test on all components. Run the following command:

```
yarn test
```

For specific components. Run the following command:

```
yarn test __tests__/unit/<TESTFILE>
```

e.g.`yarn test __tests__/unit/NotFound.test.tsx` where `<TESTFILE>` = `NotFound.test.tsx`.

## API Functions documentation

Refer to the API documentation

`src/app/api/README.md` - [CLICK HERE](src/app/api/README.md)

## Development

To start the development server, run the following command:

```
yarn dev
```

The website will be available at http://localhost:3000.

## Deployment

This app was deployed to vercel

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Made with ♥ by [Daniel Olagunju](https://github.com/todak2000) [![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40todak)](https://twitter.com/todak)

---
