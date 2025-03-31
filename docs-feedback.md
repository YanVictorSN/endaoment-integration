
# My approach:

Hello! To be able to give feedback on the docs, I made three rules for myself to follow:  
 1. Build only with the code in the docs. (Used AI to style)
 2. Don't ask anything about the docs.
 3. Avoid checking QuickStart repo.

This way, I be more capable of giving feedback based solely on the docs and my first experience.

The suggestions I put below aim to improve the docs by reducing friction. 

I hope they help make the flow even smoother. Thank you!

# Suggestions:

1.  Create a minimum `.env.example` file with `ENDAOMENT_CLIENT_ID` and `ENDAOMENT_CLIENT_SECRET` in it.
    
2.  Create a minimum flow like in the QuickStart to make it easy for people to choose between the URLs for development and production.
    
3.  Change the URLs from production to development to follow the development process and match the API docs.
    
4.  Add `https://api.dev.endaoment.org/` in the README of the integration docs and in all the five steps to follow a pattern started in `open-daf.mb`. Example:  
    _"The full reference of the fields that are returned in the response can be found in the [API Reference](https://api.dev.endaoment.org/oas#/Funds/FundsController_processFund).”_  
    This makes it easier and faster to see each endpoint spec. Missing in `login-user.md` and `search-for-org.md`.
    
5.  Remove the `TODO: ADD link to API Reference` comment in the `grant-from-daf.md` file.
    
6.  Maybe to make the integration easier, modify the `DAF creation form` to include only the minimum required data from the API. Ref: `open-daf.mb`.
    
7.  The docs follow a really good pattern where we go from one step to another, but when we reach the final step in `grant-from-daf.md`, in step **"2. Select organization to grant to,"** the docs reference:  
    _"Identical to the process of [searching for organizations](https://github.com/endaoment/endaoment-integration-docs/blob/main/docs/search-for-org.md).”_  
This assumes we have already done that, but this is the first time besides README in the docs that we encounter this reference for integration. This can cause confusion, making the dev think they already did that when it's actually the first time.
    
8.  I love how the functions are broken down into small parts to make them easier to understand, but I also suggest putting the full function with all the code right before explaining each part. This way, people can copy everything at once instead of having to piece together the function that was broken down for explanation. Also, this seems to be a pattern in my experience with other docs.
    
9.  Follow the pattern in the docs and create a minimum front-end to handle the result requests in `grant-from-daf.md`.
    
10.  `search-for-org.md` is only appears in the last step of `Prerequisites`, right before `Donate to a DAF`, but this is the first time it is mentioned. Maybe create an reference to that in the end of `Donate to a DAF`. As i explained in point 4.
    
11.  I think in `search-for-org.md`, in step **"2. Orchestrate the search request,"** the `const searchURL` is set with an extra `/`. Example:
    
    ```js
    const searchUrl = `https://api.endaoment.com//v2/orgs/search?searchTerm=${searchTerm}`;
    
    ```