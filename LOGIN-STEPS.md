# Login: what to do

## Before (you)

1. **Firebase:** Authentication → Sign-in method → Add new provider → **Email/Password** → turn on the first toggle → Save. Leave Anonymous on.
2. **Files:** this package already puts the 3 new screens in `design/prototype/`. If your screens live in a subfolder (e.g. `design/prototype/screens/`), move them there and change the paths in the prompt.

## Paste into Claude in the terminal

```text
Add login, following CLAUDE.md. New branch feature/login from main.

Commit the 3 new files in design/prototype/ first (18-Sign-in, 19-Create-account,
20-Home-signed-in) and LOGIN-STEPS.md. Build them exactly:
- SignInView at /sign-in, CreateAccountView at /create-account
- HomeView: only add the "Hi, <name>" line above "Your week"

Login:
- Username + password via Firebase Email/Password. Username: trim, lowercase,
  3–20 letters/numbers, mapped to `${username}@tracker-app.vercel.app`
  (constant in src/constants/auth.ts, never shown). Password min 6 characters.
- auth.service: signIn, createAccount, signOut. No more silent anonymous sign-in.
- createAccount: if current user is anonymous, use linkWithCredential so existing
  entries are kept. Save { name, username } on users/{uid} with merge: true.
- auth.store: uid, name, isSignedIn (not anonymous). Clear entries cache on signOut.
- Router guard: signed-out users go to /sign-in; signed-in users skip sign-in pages.
- Sign out: service and store only, no UI (not designed yet).

Errors as text under the field (aria-describedby, aria-invalid):
taken username "That username is taken. Try another one.",
wrong login "Wrong username or password.",
bad username "Use 3–20 letters or numbers.",
short password "Use at least 6 characters.",
offline "Couldn't connect. Check your internet and try again."

WCAG 2.2 AA, correct autocomplete values, show/hide password button.
Update CLAUDE.md and IMPLEMENTATION.md for login in a separate commit.
Don't run tests. Lint, type-check, push, tell me when it's ready for a PR.
```

## After (you)

1. `npm run dev` → create an account → Home says "Hi, Mariia".
2. Open the pull request, check the Vercel preview, merge.
3. **On the phone with your current data**, choose **Create an account** (not Sign in), so your existing entries are kept.
