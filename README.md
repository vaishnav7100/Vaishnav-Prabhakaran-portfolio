# Vaishnav Prabhakaran Portfolio

This is the portfolio website for Vaishnav Prabhakaran.

## Custom Domain Setup (Hostinger)

To connect your custom domain (`vaishnavprabhakaran.com`) to this GitHub repository, follow these steps:

1.  **GitHub Pages Adjustment**:
    *   Ensure the `CNAME` file is present in the repository (I have added this).
    *   Go to your GitHub Repository -> Settings -> Pages.
    *   Ensure "Custom domain" is set to `vaishnavprabhakaran.com`.
    *   Check "Enforce HTTPS".

2.  **Hostinger DNS Configuration**:
    *   Log in to your Hostinger account and go to the DNS Zone Editor for your domain.
    *   **Delete** any existing A records for `@` (root).
    *   **Add** the following A records pointing to GitHub Pages:
        *   Type: `A`, Name: `@`, Points to: `185.199.108.153`
        *   Type: `A`, Name: `@`, Points to: `185.199.109.153`
        *   Type: `A`, Name: `@`, Points to: `185.199.110.153`
        *   Type: `A`, Name: `@`, Points to: `185.199.111.153`
    *   **Add** a CNAME record for `www`:
        *   Type: `CNAME`, Name: `www`, Points to: `vaishnav7100.github.io`
