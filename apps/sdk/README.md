# SocialConnect NodeJS SDK

This is the NodeJS SDK for SocialConnect (social media scheduling tool).

You can start by installing the package:

```bash
npm install @socialconnect/node
```

## Usage
```typescript
import SocialConnect from '@socialconnect/node';
const socialConnect = new SocialConnect('your api key', 'your self-hosted instance (optional)');
```

**Base URL (second argument):** The default base URL points to the hosted Postiz API. For **self-hosted** or **SocialConnect** instances you **must** pass your API base URL as the second argument (e.g. `'https://api.yourdomain.com'`). All requests (posts, uploads, integrations) use this base; omit it only when using the default hosted API.

The available methods are:
- `post(posts: CreatePostDto)` - Schedule a post to SocialConnect
- `postList(filters: GetPostsDto)` - Get a list of posts
- `upload(file: Buffer, extension: string)` - Upload a file to SocialConnect
- `integrations()` - Get a list of connected channels
- `deletePost(id: string)` - Delete a post by ID

Alternatively you can use the SDK with curl, check the API documentation for your SocialConnect instance for more information.
