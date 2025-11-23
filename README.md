# PenWeave
 Penweave is a CodePen‑like tool that lets users run their HTML/CSS/JS in a browser environment with secure preview and sharing. Built using React, Supabase, DaisyUI.

![Project Editor page screenshot](https://github.com/user-attachments/assets/e2aa4139-2f97-4718-a434-c551471516d8)

## Features
- Write code in HTML, CSS and JS.
- Generates instant live preview.
- Allows public and private projects.
- Public projects can be shared with anyone even those who don't use the platform. [See Demo](https://penweave.pages.dev/projects/955f3653-d771-4ab3-9ef5-b6299c6606e9)
- Allows to fork public projects and make your changes!
- Follow other creators, bookmark projects, like them...

## Run Locally
There are essentially 2 projects. One is the platform itself and other one is the code runner which generates the preview. They communicate via the [Postmessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).
They run on two different origins(domain) for security reasons.

1. Clone repo
2. Copy `.env.example` to `.env` and fill in your Supabase credentials. The `VITE_CODE_RUNNER_URL` is the URL of the runner that we run later.
3. Run `npm run dev`
4. cd into `/runner`
5. Copy its `.env.example` to `.env` and fill the main app's URL.
6. Run `npm run dev`

Now you should be able to access the project by the URL that outputted when you ran `npm run dev` in the root of the project `/`

The frontend of this app is React and as for the backend it is Supabase, You should set up a new project in Supabase and have its credentials.

To get Google OAuth working, enable it on your Supabase dashboard along with regular Email sign up.

Also don't forget to run `supabase/schema.sql` files content in your Supabase project to generate the necessary tables.

You should also change Supabase URL Configuration if necessary in the dashboard.

## Credits
The inspiration is very much from [Codepen](https://codepen.io/). 
