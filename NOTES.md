# Authentication:

Most apps resolve around users

When building for users, we need to consider three concepts;

- Identity - verifying the user through authentication
- Sessions - keep track of a user's logged-in state across requests.
- Access - controls what they can do.

In developer terms, we call these authentication, session management, authorization.

With React SPA, we are only dealing with client-side code.

With Next.js we need to protect the app from three different angles:

- client-side
- server-side
- API routes

1. Let user sign up
2. Give them a way to sign in
3. Enable them to manage their account(like changing their password, email updates, etc)
4. Show or hide UI elements based on whether they are logged in or not
5. Protect certain pages or routes from unauthorized access
6. Access session and user data when needed.
7. Set up role-based access control(admin, editor, user and so on)
8. Provide a way to sign out.

It is recommended to use an Auth provider like Auth0, Firebase, or Clerk.

# Setup a clerk account

Go to https://clerk.com/
Click on "Get started"
Sign up with your email
Get code from your email
Create an application "Nextjs" that will email, google, and github.
Click "Create Application"
Choose "Next.js" and follow the instructions as follows:

1. npm install @clerk/nextjs
2. In project create a .env.local file and add the following:

- your clerk frontend api key

3. Create a middleware.ts file in the src folder and add the following:
   import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
matcher: [
// Skip Next.js internals and all static files, unless found in search params
'/((?!\_next|[^?]_\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest))._)',
// Always run for API routes
'/(api|trpc)(.\*)',
],
};

4. Wrap the entire application with the ClerkProvider component.
   In the route layout file.
   import { ClerkProvider } from "@clerk/nextjs";
   And wrap the entire JSX application with the ClerkProvider component.

# Protected Routes

Use clerk's middleware to protect routes
import { createRouteMatcher } from "@clerk/nextjs";

//_ pass in an array of routes you want to protect.
// const isProtectedRoute = createRouteMatcher(['/user-profile']);
const isPublicRoute = createRouteMatcher(["/", "/sign-in(._)", "/sign-up(.\*)"]);

export default clerkMiddleware(async (auth, req) => {
// if (isProtectedRoute(req)) await auth.protect();
if (!isPublicRoute(req)) await auth.protect();
});

# Session and User Data

When building web application we often need to access this data to personalize the user experience and track user action with their account. To read user and session data, Clerk provides two helpers auth() and currentUser() functions.

The auth() function returns the current session and user data (the auth object). It is available in the Clerk middleware and in API routes.

The currentUser() function returns the current user data(the backend user object) . It is available in the Clerk middleware and in API routes.

They are useful in <u><i>server components</i></u>, route handlers, and middleware; but don't work in <u>client components</u>.
See "app/dashboard/page.tsx" for an example of how to use these functions.

In <u>client components</u>, you can use the useUser() hook to access the current user dat and useAuth() hook to access the current session and user data.

see "src/components/count.tsx" for an example of how to use these functions.

# User Roles and Permissions

Most applications have different types of users with different roles and permissions. Clerk provides a way to manage user roles and permissions.

## How to implement role based access control (RBAC) using Clerk

1. Configure the session token to include the user's roles.
   - Clerk gives us something called "user metadata" which is a key-value store that can be used to store additional information about the user.
   - We will use this to store the user's roles.
   - publicMetadata is accessible to the client as "read-only" in the browser.
   - to build a basic RBAC system, we will use the publicMetadata to store the user's roles. and make sure it is readily available to the client in the session token.
   - we can quickly check the user's roles in the client-side code without have to make an extra network request (API) every time we need the information.
2. Go to the Clerk dashboard and on the "configure" tab, click on session tab
3. Under "customize session token" click edit.
    {
      "metadata": "{{user.public_metadata}}"
     } 
4. Save changes
   
5. For TypeScript, create a app/types/global.d.ts file 
   1. add export {} -This make the file a module 
6. On the clerk website dashboard, go to the "Users" tab and edit your user account to be admin in the public metadata.
   
   Edit public metadata


   {
    "role": "admin"
   }

7. Product a new admin route.  app/admin/page.tsx
   1. we will protect this route using the Clerk middleware. RBAC is implemented in the middleware.ts file.

# Customizing the Clerk Components
