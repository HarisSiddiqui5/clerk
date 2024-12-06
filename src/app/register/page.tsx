'use client';

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification();
      setPendingVerification(true);
    } catch (error: any) {
      console.error("Error creating account:", error);
      alert(error?.errors?.[0]?.message || "Something went wrong");
    }
  };

  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      } else {
        console.error("Unexpected sign-up status:", completeSignUp.status);
      }
    } catch (error: any) {
      console.error("Error verifying email:", error);
      alert(error?.errors?.[0]?.message || "Verification failed");
    }
  };

  return (
    <div className="border p-5 rounded" style={{ width: '500px' }}>
      <h1 className="text-2xl mb-4">Register</h1>

      {!pendingVerification ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
              required
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Create an account
          </button>
        </form>
      ) : (
        <form onSubmit={onPressVerify} className="space-y-6">
          <div>
            <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Verify Email
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;
