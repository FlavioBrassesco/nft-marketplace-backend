# TODO

- corregir locals.users

- setup an event based caching mechanism (blockchain event listener + instant record when doing transactions via marketplace)
- setup a cache middleware for common view requests
-- middleware in process. We need to check the contracts from were we are returning the logs.  
-- need to check we don't return cached unauth responses  
-- for bigger projects, this middleware should become only a checker, and the cache writing system should move to a separate instance.
- Parse JSON from tokenURI and contractURI
- Paginate blockchain requests
