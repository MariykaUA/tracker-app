# Account screen: sign out + delete account

## Before (you)

Unzip this package into the root of your project. It adds/updates:

- `design/prototype/20-Home-signed-in.dc.html` (updated: the mascot is now the Account button)
- `design/prototype/21-Account.dc.html` (new)
- `design/prototype/22-Delete-account.dc.html` (new)

Nothing to change in the Firebase console.

## Paste into Claude in the terminal

Do this after the fix/user-switch branch is merged.

```text
Add an account screen with sign out and delete account, following CLAUDE.md.
New branch feature/account from an up-to-date main.

First commit the updated/new design files in design/prototype/ (20-Home-signed-in,
21-Account, 22-Delete-account) and ACCOUNT-STEPS.md. Build them exactly:
- HomeView: the mascot in the header becomes a link to /account,
  aria-label "Your account" (keep the "Your week, Mariia" heading as in 20).
- AccountView at /account: name and username, "Sign out" button,
  "Delete account" section linking to /account/delete.
- DeleteAccountView at /account/delete: password field, "Delete forever"
  and "Keep my account" (back to /account).

Sign out: signOut() from the auth store, then go to /sign-in.

Delete account (only services touch Firebase):
1. Reauthenticate with the typed password (EmailAuthProvider.credential +
   reauthenticateWithCredential). Firebase requires a recent login to delete.
2. Delete all docs in users/{uid}/entries in batches (writeBatch, max 500 each),
   then delete users/{uid}.
3. Delete the Auth user (deleteUser).
4. Reset all stores and go to /sign-in, announce "Your account was deleted."
   through the live region.
Order matters: data first, then the Auth user (after deleting the user,
the security rules no longer allow deleting the data).

States and errors (text under the field, aria-describedby, aria-invalid):
- empty password → "Type your password to confirm."
- wrong password (auth/invalid-credential) → "That password isn't right."
- network error → "Couldn't connect. Nothing was deleted."
- while deleting: disable both buttons, aria-busy, button text "Deleting…"

Routes /account and /account/delete need sign-in (existing guard).
Page titles "Account · Tracker", "Delete account · Tracker".
WCAG 2.2 AA. Update IMPLEMENTATION.md (screens map, auth section) in a separate
docs commit. Small Conventional Commits. Don't run tests. Lint, type-check,
push, and tell me when it's ready for a PR.
```

## After (you)

1. `npm run dev` → create a **test** account → log one check-in.
2. Tap the mascot → Account → Sign out → you land on Sign in.
3. Sign in again → Account → Delete account → wrong password first (error shows), then the right one.
4. Check Firebase: the user is gone from **Authentication → Users**, and `users/{uid}` is gone from **Firestore**.
5. Open the pull request, check the Vercel preview, merge.

Never test delete on your real account.
