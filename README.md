# YeplCamp V2

Built using Next.js

## Known Vulnerabilities:

1. **The auth and session management is weak:** The redirect on logout doesn't work properly. After you have logged out, you'll still stay on the same page and the page becomes unresponsive. The `refresh` function in `SessionProvider` should be fixed.

## Notes

There are a lot of UX related improvements that could be made.
