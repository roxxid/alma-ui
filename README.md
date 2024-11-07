This is app is hosted at [https://alma-ui-gilt.vercel.app/](https://alma-ui-gilt.vercel.app/)

Pages:
- The publicly available form loads up when you reach the main route
- Navigate to the /login page for the login form 
```bash
email: test@alma.com 
pass: 12345678
```
- Upon signing in the /dashboard page should load up with the Leads table view


## Running locally

Use the following commands to run the app locally

```bash
npm install --force
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Libraries used
- shadcn for UI elements styling
- radix-ui for react UI elements
- react-hook-forms for forms
- zod for validations and type safety
- NextAuth for mock authentication
- jose for jwt verification
- tailwind for css
