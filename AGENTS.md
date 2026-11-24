# Architecture
- Store website content as a validated versioned document, with public published content separated from admin-only drafts and revisions, so drafts cannot leak.
- Enforce CMS administrator permissions in authenticated server functions and database/storage policies; account creation never grants administrator access.
- Render public sections through a shared content context so the CMS and existing animation components use one content contract.
