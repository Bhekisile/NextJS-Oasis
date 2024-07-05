"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestId = session.user?.guestId;
  if (!guestId) {
    console.error("Guest ID is undefined or invalid:", guestId);
    throw new Error("Invalid guest ID");
  }

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  try {
    const { data, error } = await supabase
      .from("guests")
      .update(updateData)
      .eq("id", guestId);

    if (error) {
      console.error("Error updating guest:", error);
      throw new Error("Guest could not be updated");
    }

    revalidatePath('/account/profile');
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    throw err;
  }
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}