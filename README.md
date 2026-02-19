# Vaishnav Prabhakaran Portfolio

This is the portfolio website for Vaishnav Prabhakaran.

## Custom Domain Setup (Hostinger)

To connect your custom domain (`vaishnavprabhakaran.in`) to this GitHub repository, follow these steps:

1.  **GitHub Pages Adjustment**:
    *   Ensure the `CNAME` file is present in the repository (I have added this).
    *   Go to your GitHub Repository -> Settings -> Pages.
    *   Ensure "Custom domain" is set to `vaishnavprabhakaran.in`.
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

## Google Search Console Verification

To verify your domain (`vaishnavprabhakaran.in`) on Google Search Console:

1.  Go to [Google Search Console](https://search.google.com/search-console).
2.  Add your property: `https://vaishnavprabhakaran.in`.
3.  Choose **Domain** property type (recommended) or **URL prefix**.
4.  **Verification Method (DNS)**:
    *   Copy the TXT record provided by Google (starts with `google-site-verification=...`).
    *   Go to your Hostinger DNS Zone Editor.
    *   Add a new record:
        *   **Type**: `TXT`
        *   **Name**: `@`
        *   **Value**: [Paste the Google code here]
        *   **TTL**: Default
    *   Wait a few minutes and click "Verify" in GSC.
