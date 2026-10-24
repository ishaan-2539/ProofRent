This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
public/
  favicon.svg
  icons.svg
src/
  api/
    client.ts
  assets/
    hero.png
    react.svg
    vite.svg
  components/
    common/
      Badge.tsx
      Button.tsx
      ConfidenceBadge.tsx
      ErrorBoundary.tsx
      EvidenceLabelBadge.tsx
      Navbar.tsx
      Spinner.tsx
      StatePanel.tsx
    home/
      ExampleButtons.tsx
      ListingInput.tsx
      SupportedPortals.tsx
    report/
      CostLadderView.tsx
      DecisionBar.tsx
      EvidenceDrawer.tsx
      ExportPdfButton.tsx
      FairPriceCard.tsx
      FindingCard.tsx
      HighlightedText.tsx
      JobStreamFeed.tsx
      MapPinsView.tsx
      MatchSideBySide.tsx
      ModuleBlock.tsx
      PriceGapBadge.tsx
      QuestionsList.tsx
      RedStringView.tsx
      ReportView.tsx
      ShareBar.tsx
      SignalChips.tsx
  hooks/
    useInvestigationStream.ts
  pages/
    HomePage.tsx
    PreflightPage.tsx
    ReportPage.tsx
  types/
    api.ts
  App.css
  App.tsx
  index.css
  main.tsx
.gitignore
eslint.config.js
index.html
package.json
postcss.config.js
README.md
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
````

# Files

## File: public/favicon.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="46" fill="none" viewBox="0 0 48 46"><path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" style="fill:#863bff;fill:color(display-p3 .5252 .23 1);fill-opacity:1"/><mask id="a" width="48" height="46" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M25.842 44.938c-.664.844-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.183c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.498 0-3.579-1.842-3.579H1.133c-.92 0-1.456-1.04-.92-1.787L9.91.473c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.578 1.842 3.578h11.377c.943 0 1.473 1.088.89 1.832L25.843 44.94z" style="fill:#000;fill-opacity:1"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#ede6ff" rx="5.508" ry="14.704" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -4.47 31.516)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#ede6ff" rx="10.399" ry="29.851" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -39.328 7.883)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#7e14ff" rx="5.508" ry="30.487" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -25.913 -14.639)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -32.644 -3.334)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -34.34 30.47)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#ede6ff" rx="14.072" ry="22.078" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="rotate(93.35 24.506 48.493)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx=".387" cy="8.972" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(39.51 .387 8.972)"/></g><g filter="url(#k)"><ellipse cx="47.523" cy="-6.092" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 47.523 -6.092)"/></g><g filter="url(#l)"><ellipse cx="41.412" cy="6.333" fill="#47bfff" rx="5.971" ry="9.665" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 41.412 6.333)"/></g><g filter="url(#m)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#n)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#o)"><ellipse cx="35.651" cy="29.907" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 35.651 29.907)"/></g><g filter="url(#p)"><ellipse cx="38.418" cy="32.4" fill="#47bfff" rx="5.971" ry="15.297" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 38.418 32.4)"/></g></g><defs><filter id="b" width="60.045" height="41.654" x="-19.77" y="16.149" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-54.613" y="-7.533" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-49.64" y="2.03" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-45.045" y="20.029" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-43.513" y="21.178" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="15.756" y="-17.901" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-27.636" y="-22.853" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="20.116" y="-38.415" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="24.641" y="-11.323" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="8.244" y="-2.416" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="18.713" y="10.588" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter></defs></svg>
````

## File: public/icons.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="bluesky-icon" viewBox="0 0 16 17">
    <g clip-path="url(#bluesky-clip)"><path fill="#08060d" d="M7.75 7.735c-.693-1.348-2.58-3.86-4.334-5.097-1.68-1.187-2.32-.981-2.74-.79C.188 2.065.1 2.812.1 3.251s.241 3.602.398 4.13c.52 1.744 2.367 2.333 4.07 2.145-2.495.37-4.71 1.278-1.805 4.512 3.196 3.309 4.38-.71 4.987-2.746.608 2.036 1.307 5.91 4.93 2.746 2.72-2.746.747-4.143-1.747-4.512 1.702.189 3.55-.4 4.07-2.145.156-.528.397-3.691.397-4.13s-.088-1.186-.575-1.406c-.42-.19-1.06-.395-2.741.79-1.755 1.24-3.64 3.752-4.334 5.099"/></g>
    <defs><clipPath id="bluesky-clip"><path fill="#fff" d="M.1.85h15.3v15.3H.1z"/></clipPath></defs>
  </symbol>
  <symbol id="discord-icon" viewBox="0 0 20 19">
    <path fill="#08060d" d="M16.224 3.768a14.5 14.5 0 0 0-3.67-1.153c-.158.286-.343.67-.47.976a13.5 13.5 0 0 0-4.067 0c-.128-.306-.317-.69-.476-.976A14.4 14.4 0 0 0 3.868 3.77C1.546 7.28.916 10.703 1.231 14.077a14.7 14.7 0 0 0 4.5 2.306q.545-.748.965-1.587a9.5 9.5 0 0 1-1.518-.74q.191-.14.372-.293c2.927 1.369 6.107 1.369 8.999 0q.183.152.372.294-.723.437-1.52.74.418.838.963 1.588a14.6 14.6 0 0 0 4.504-2.308c.37-3.911-.63-7.302-2.644-10.309m-9.13 8.234c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.894 0 1.614.82 1.599 1.82.001 1-.705 1.82-1.6 1.82m5.91 0c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.893 0 1.614.82 1.599 1.82 0 1-.706 1.82-1.6 1.82"/>
  </symbol>
  <symbol id="documentation-icon" viewBox="0 0 21 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="m15.5 13.333 1.533 1.322c.645.555.967.833.967 1.178s-.322.623-.967 1.179L15.5 18.333m-3.333-5-1.534 1.322c-.644.555-.966.833-.966 1.178s.322.623.966 1.179l1.534 1.321"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M17.167 10.836v-4.32c0-1.41 0-2.117-.224-2.68-.359-.906-1.118-1.621-2.08-1.96-.599-.21-1.349-.21-2.848-.21-2.623 0-3.935 0-4.983.369-1.684.591-3.013 1.842-3.641 3.428C3 6.449 3 7.684 3 10.154v2.122c0 2.558 0 3.838.706 4.726q.306.383.713.671c.76.536 1.79.64 3.581.66"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M3 10a2.78 2.78 0 0 1 2.778-2.778c.555 0 1.209.097 1.748-.047.48-.129.854-.503.982-.982.145-.54.048-1.194.048-1.749a2.78 2.78 0 0 1 2.777-2.777"/>
  </symbol>
  <symbol id="github-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clip-rule="evenodd"/>
  </symbol>
  <symbol id="social-icon" viewBox="0 0 20 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M12.5 6.667a4.167 4.167 0 1 0-8.334 0 4.167 4.167 0 0 0 8.334 0"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M2.5 16.667a5.833 5.833 0 0 1 8.75-5.053m3.837.474.513 1.035c.07.144.257.282.414.309l.93.155c.596.1.736.536.307.965l-.723.73a.64.64 0 0 0-.152.531l.207.903c.164.715-.213.991-.84.618l-.872-.52a.63.63 0 0 0-.577 0l-.872.52c-.624.373-1.003.094-.84-.618l.207-.903a.64.64 0 0 0-.152-.532l-.723-.729c-.426-.43-.289-.864.306-.964l.93-.156a.64.64 0 0 0 .412-.31l.513-1.034c.28-.562.735-.562 1.012 0"/>
  </symbol>
  <symbol id="x-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clip-rule="evenodd"/>
  </symbol>
</svg>
````

## File: src/api/client.ts
````typescript
import type {
  ApiError,
  ErrorResponse,
  InvestigateRequest,
  InvestigateResponse,
  Report,
  ExampleListing,
  PreflightResult,
  DecisionRequest,
} from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiClientError extends Error {
  error: ApiError;
  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiClientError";
    this.error = error;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let apiError: ApiError;
    try {
      const errJson = (await res.json()) as ErrorResponse;
      apiError = errJson.error;
    } catch {
      apiError = {
        code: "INTERNAL",
        message: "An unexpected network error occurred.",
        next_step: "Please try again.",
      };
    }
    throw new ApiClientError(apiError);
  }

  return res.json() as Promise<T>;
}

export async function startInvestigation(req: InvestigateRequest): Promise<InvestigateResponse> {
  return request<InvestigateResponse>("/api/investigations", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getReport(reportId: string): Promise<Report> {
  return request<Report>(`/api/reports/${reportId}`);
}

export async function getExamples(): Promise<ExampleListing[]> {
  return request<ExampleListing[]>("/api/examples");
}

export async function getPreflight(): Promise<PreflightResult> {
  return request<PreflightResult>("/api/preflight");
}

export async function submitMatchDecision(reportId: string, req: DecisionRequest): Promise<Report> {
  return request<Report>(`/api/reports/${reportId}/decision`, {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export function getPdfUrl(reportId: string): string {
  return `${BASE_URL}/api/reports/${reportId}/pdf`;
}

export async function submitDecision(
  reportId: string,
  body: { verdict: string; notes?: string }
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/investigations/${reportId}/decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit review decision (${res.status})`);
  }
}

export async function exportPdf(reportId: string): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/api/investigations/${reportId}/export/pdf`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to export PDF report (${res.status})`);
  }

  return await res.blob();
}
````

## File: src/assets/react.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
````

## File: src/assets/vite.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" width="77" height="47" fill="none" aria-labelledby="vite-logo-title" viewBox="0 0 77 47"><title id="vite-logo-title">Vite</title><style>.parenthesis{fill:#000}@media (prefers-color-scheme:dark){.parenthesis{fill:#fff}}</style><path fill="#9135ff" d="M40.151 45.71c-.663.844-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.493c-.92 0-1.457-1.04-.92-1.788l7.479-10.471c1.07-1.498 0-3.578-1.842-3.578H15.443c-.92 0-1.456-1.04-.92-1.788l9.696-13.576c.213-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.472c-1.07 1.497 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.087.89 1.83L40.153 45.712z"/><mask id="a" width="48" height="47" x="14" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M40.047 45.71c-.663.843-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.389c-.92 0-1.457-1.04-.92-1.788l7.479-10.472c1.07-1.497 0-3.578-1.842-3.578H15.34c-.92 0-1.456-1.04-.92-1.788l9.696-13.575c.213-.297.556-.474.92-.474H53.93c.92 0 1.456 1.04.92 1.788L47.37 13.03c-1.07 1.498 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.088.89 1.831L40.049 45.712z"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#eee6ff" rx="5.508" ry="14.704" transform="rotate(269.814 20.96 11.29)scale(-1 1)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#eee6ff" rx="10.399" ry="29.851" transform="rotate(89.814 -16.902 -8.275)scale(1 -1)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#8900ff" rx="5.508" ry="30.487" transform="rotate(89.814 -19.197 -7.127)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.928 4.177)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.738 5.52)scale(1 -1)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#eee6ff" rx="14.072" ry="22.078" transform="rotate(93.35 31.245 55.578)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx="14.592" cy="9.743" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(39.51 14.592 9.743)"/></g><g filter="url(#k)"><ellipse cx="61.728" cy="-5.321" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 61.728 -5.32)"/></g><g filter="url(#l)"><ellipse cx="55.618" cy="7.104" fill="#00c2ff" rx="5.971" ry="9.665" transform="rotate(37.892 55.618 7.104)"/></g><g filter="url(#m)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#n)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#o)"><ellipse cx="49.857" cy="30.678" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 49.857 30.678)"/></g><g filter="url(#p)"><ellipse cx="52.623" cy="33.171" fill="#00c2ff" rx="5.971" ry="15.297" transform="rotate(37.892 52.623 33.17)"/></g></g><path d="M6.919 0c-9.198 13.166-9.252 33.575 0 46.789h6.215c-9.25-13.214-9.196-33.623 0-46.789zm62.424 0h-6.215c9.198 13.166 9.252 33.575 0 46.789h6.215c9.25-13.214 9.196-33.623 0-46.789" class="parenthesis"/><defs><filter id="b" width="60.045" height="41.654" x="-5.564" y="16.92" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-40.407" y="-6.762" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-35.435" y="2.801" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-30.84" y="20.8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-29.307" y="21.949" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="29.961" y="-17.13" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-13.43" y="-22.082" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="34.321" y="-37.644" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="38.847" y="-10.552" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="22.45" y="-1.645" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="32.919" y="11.36" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter></defs></svg>
````

## File: src/components/common/Badge.tsx
````typescript
import React from "react";

interface BadgeProps {
  tone?: "blue" | "green" | "yellow" | "red" | "gray";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ tone = "gray", children }) => {
  const tones = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    yellow: "bg-amber-100 text-amber-800 border-amber-200",
    red: "bg-rose-100 text-rose-800 border-rose-200",
    gray: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tones[tone]}`}>
      {children}
    </span>
  );
};
````

## File: src/components/common/Button.tsx
````typescript
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", disabled, children, className = "", ...props }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-500",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button disabled={disabled} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
````

## File: src/components/common/ConfidenceBadge.tsx
````typescript
import React from "react";
import type { Confidence } from "@/types/api";
import { Badge } from "./Badge";
import { getConfidenceText } from "@/lib/labels";

export const ConfidenceBadge: React.FC<{ confidence: Confidence }> = ({ confidence }) => {
  const toneMap: Record<Confidence, "green" | "yellow" | "red"> = {
    high: "green",
    medium: "yellow",
    low: "red",
  };
  return <Badge tone={toneMap[confidence]}>{getConfidenceText(confidence)}</Badge>;
};
````

## File: src/components/common/ErrorBoundary.tsx
````typescript
import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 space-y-2">
          <h4 className="font-semibold">{this.props.fallbackTitle || "Something went wrong"}</h4>
          <p className="text-xs">This section could not be rendered.</p>
          {this.props.onRetry && (
            <button
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onRetry?.();
              }}
              className="px-3 py-1 bg-rose-600 text-white text-xs rounded hover:bg-rose-700"
            >
              Retry
            </button>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
````

## File: src/components/common/EvidenceLabelBadge.tsx
````typescript
import React from "react";
import type { EvidenceLabel } from "@/types/api";
import { Badge } from "./Badge";
import { getEvidenceLabelText } from "@/lib/labels";

export const EvidenceLabelBadge: React.FC<{ label: EvidenceLabel }> = ({ label }) => {
  const toneMap: Record<EvidenceLabel, "green" | "blue" | "yellow" | "gray"> = {
    verified: "green",
    inferred: "blue",
    uncertain: "yellow",
    unknown: "gray",
  };
  return <Badge tone={toneMap[label]}>{getEvidenceLabelText(label)}</Badge>;
};
````

## File: src/components/common/Navbar.tsx
````typescript
import React from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-slate-900 font-bold text-xl tracking-tight">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-sm font-black">PR</span>
          <span>ProofRent</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            to="/preflight"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            System Status
          </Link>
        </nav>
      </div>
    </header>
  );
};
````

## File: src/components/common/Spinner.tsx
````typescript
import React from "react";

export const Spinner: React.FC<{ label?: string }> = ({ label }) => (
  <div className="inline-flex items-center space-x-2">
    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    {label && <span className="text-sm font-medium text-slate-600">{label}</span>}
  </div>
);
````

## File: src/components/common/StatePanel.tsx
````typescript
import React from "react";
import type { ModuleStatus } from "@/types/api";
import { Button } from "./Button";
import { Spinner } from "./Spinner";

interface StatePanelProps {
  kind: ModuleStatus;
  title: string;
  message?: string | null;
  nextStep?: string | null;
  onRetry?: () => void;
}

export const StatePanel: React.FC<StatePanelProps> = ({ kind, title, message, nextStep, onRetry }) => {
  if (kind === "working" || kind === "pending") {
    return (
      <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
        <Spinner />
        <h4 className="font-semibold text-slate-800">{title}</h4>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    );
  }

  const bgMap: Record<string, string> = {
    failed: "bg-rose-50 border-rose-200",
    partial: "bg-amber-50 border-amber-200",
    empty: "bg-slate-50 border-slate-200",
    not_checked: "bg-slate-50 border-slate-200",
  };

  return (
    <div className={`p-6 rounded-xl border ${bgMap[kind] || "bg-slate-50 border-slate-200"} space-y-3`}>
      <h4 className="font-semibold text-slate-800">{title}</h4>
      {message && <p className="text-sm text-slate-600">{message}</p>}
      {nextStep && <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{nextStep}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};
````

## File: src/components/home/ExampleButtons.tsx
````typescript
import React from "react";
import type { ExampleListing } from "../../types/api";

interface ExampleButtonsProps {
  examples: ExampleListing[];
  onPick: (example: ExampleListing) => void;
}

export const ExampleButtons: React.FC<ExampleButtonsProps> = ({ examples, onPick }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Try an example run:</p>
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.example_id}
            onClick={() => onPick(ex)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors text-left"
          >
            <span className="font-semibold text-blue-600 block">{ex.title}</span>
            <span className="text-slate-500">{ex.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
````

## File: src/components/home/ListingInput.tsx
````typescript
import { useState } from 'react';
import { validateListingInput } from '../../lib/validators';

interface ListingInputProps {
  onSubmit: (url: string) => void;
  busy?: boolean;
}

export function ListingInput({ onSubmit, busy = false }: ListingInputProps) {
  const [url, setUrl] = useState('https://www.housing.com/pg/sunrise-pg-koramangala-560034');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateListingInput(url);
    if (!result.ok) {
      setError(result.message || 'Please enter a valid listing URL');
      return;
    }
    setError(null);
    onSubmit(url.trim());
  };

  const handlePreset = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setError(null);
  };

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSubmit} className="relative max-w-2xl flex items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-[#B80D1D] text-sm">🔗</span>
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="Paste Housing.com, MagicBricks, or NoBroker URL..."
            disabled={busy}
            className="w-full pl-11 pr-36 py-4 rounded-2xl bg-white text-[#1A261C] placeholder-[#1A261C]/40 font-medium text-sm border-2 border-[#F4EFEA] focus:border-[#B80D1D] focus:ring-4 focus:ring-[#B80D1D]/10 shadow-sm transition-all outline-none disabled:opacity-70"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="absolute right-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B80D1D] via-[#C80D2E] to-[#8B0000] hover:from-[#8B0000] hover:to-[#5A0000] text-white font-bold text-sm shadow-red-glow hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 active:scale-95"
        >
          {busy ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Analyse Listing</span>
              <span>→</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="text-xs text-[#B80D1D] font-semibold pl-2 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}

      {/* Quick Links below search */}
      <div className="flex items-center gap-3 text-xs text-[#1A261C]/60 pt-1">
        <span className="font-semibold text-[#1A261C]/40">Popular Sample URLs:</span>
        <button
          type="button"
          onClick={() => handlePreset('https://www.housing.com/pg/sunrise-pg-koramangala-560034')}
          className="hover:text-[#B80D1D] underline decoration-[#F4EFEA] transition-colors"
        >
          Housing.com
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => handlePreset('https://www.magicbricks.com/pg-in-bangalore-ppp-id-99812')}
          className="hover:text-[#B80D1D] underline decoration-[#F4EFEA] transition-colors"
        >
          MagicBricks
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => handlePreset('https://www.nobroker.in/pg-sunrise-koramangala')}
          className="hover:text-[#B80D1D] underline decoration-[#F4EFEA] transition-colors"
        >
          NoBroker
        </button>
      </div>
    </div>
  );
}
````

## File: src/components/home/SupportedPortals.tsx
````typescript
import React from "react";
import constants from "@shared/constants.json";

export const SupportedPortals: React.FC = () => (
  <div className="text-center space-y-1">
    <p className="text-xs text-slate-400 font-medium">Supported Delhi NCR Portals:</p>
    <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500 font-medium">
      {constants.portals.map((p) => (
        <span key={p.id} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
          {p.display_name}
        </span>
      ))}
    </div>
  </div>
);
````

## File: src/components/report/CostLadderView.tsx
````typescript
import type { CostLadder, SourceRef } from '../../types/api';

interface CostLadderViewProps {
  ladder: CostLadder;
  onOpenEvidence?: (source: SourceRef) => void;
}

export function CostLadderView({ ladder, onOpenEvidence }: CostLadderViewProps) {
  if (!ladder) return null;

  const headline = ladder.headline || 'Move-in & Monthly Financial Obligations';
  const totalFirstMonth = ladder.total_first_month || 0;
  const monthlyRecurring = ladder.monthly_recurring || 0;
  const items = ladder.items || [];

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F4EFEA]">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
            Financial Breakdown Audit
          </span>
          <h3 className="font-display font-extrabold text-lg text-[#1A261C]">
            {headline}
          </h3>
        </div>
        <span className="text-xs font-bold bg-[#FAF8F5] border border-[#F4EFEA] text-[#1A261C] px-3 py-1 rounded-full shadow-sm">
          {items.length} Line Items
        </span>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1A261C] to-[#121B13] text-white shadow-md space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FAF8F5]/70">
            Total First Month Outlay
          </span>
          <div className="font-display text-2xl font-extrabold text-[#FAF8F5]">
            ₹{totalFirstMonth.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#FAF8F5]/60">Includes rent, security deposit & fees</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E9DEC3] space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
            Est. Monthly Recurring
          </span>
          <div className="font-display text-2xl font-extrabold text-[#1A261C]">
            ₹{monthlyRecurring.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#1A261C]/60">Base rent + recurring obligations</p>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A261C]/50">
          Itemized Outlay Breakdown
        </h4>
        <div className="space-y-2">
          {items.map((item: any, idx: number) => {
            const isHidden = item.is_hidden_cost || item.hidden;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  isHidden
                    ? 'bg-[#B80D1D]/5 border-[#B80D1D]/30'
                    : 'bg-white border-[#F4EFEA] hover:border-[#1A261C]/20'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1A261C]">
                      {item.label || item.name}
                    </span>
                    {isHidden && (
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#B80D1D] text-white px-2 py-0.5 rounded-full">
                        Hidden Fee Flag
                      </span>
                    )}
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-[#1A261C]/60 italic">
                      {item.note}
                    </p>
                  )}
                </div>

                <div className="font-display text-sm font-extrabold text-[#1A261C]">
                  ₹{Number(item.amount || 0).toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/report/DecisionBar.tsx
````typescript
import React, { useState } from "react";
import { submitDecision } from "../../api/client";

export type DecisionVerdict = "legit" | "suspicious" | "scam";
import { Button } from "../common/Button";

interface DecisionBarProps {
  reportId: string;
  onDecisionSubmitted?: () => void;
}

export const DecisionBar: React.FC<DecisionBarProps> = ({ reportId, onDecisionSubmitted }) => {
  const [verdict, setVerdict] = useState<DecisionVerdict>("suspicious");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await submitDecision(reportId, { verdict, notes });
      setSubmitted(true);
      if (onDecisionSubmitted) onDecisionSubmitted();
    } catch {
      setError("Failed to record review decision.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm font-medium">
        Decision recorded: <span className="font-bold uppercase">{verdict}</span>. Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
      <div>
        <h3 className="font-bold text-slate-900 text-lg">Human Review & Decision</h3>
        <p className="text-xs text-slate-500">Record your evaluation of this listing</p>
      </div>

      {error && <div className="text-xs text-rose-600 font-medium">{error}</div>}

      <div className="flex flex-wrap gap-3">
        {(["legit", "suspicious", "scam"] as DecisionVerdict[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVerdict(v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize border transition-colors ${
              verdict === v
                ? v === "legit"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : v === "suspicious"
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-rose-600 text-white border-rose-600"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <textarea
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes or reason for this decision..."
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting..." : "Save Review Decision"}
      </Button>
    </div>
  );
};
````

## File: src/components/report/EvidenceDrawer.tsx
````typescript
import type { SourceRef } from '../../types/api';

interface EvidenceDrawerProps {
  source: SourceRef | null;
  onClose: () => void;
}

export function EvidenceDrawer({ source, onClose }: EvidenceDrawerProps) {
  if (!source) return null;

  const src = source as any;
  const url = src?.url;
  const screenshotUrl = src?.screenshot_url || src?.screenshot || src?.image_url;
  const platform = src?.platform || src?.source_platform || 'External Platform';
  const title = src?.title || 'Evidence Source';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#F4EFEA]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F4EFEA] bg-[#FAFAFC]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B80D1D]">
              Proof & Evidence
            </span>
            <h3 className="text-base font-bold text-[#1A261C]">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#1A261C]/60 hover:text-[#1A261C] hover:bg-[#F4EFEA] transition-colors"
            aria-label="Close drawer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Metadata Card */}
          <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A261C]/60">
                Platform
              </span>
              <span className="text-xs font-bold text-[#1A261C] capitalize">
                {platform}
              </span>
            </div>

            {url && (
              <div className="pt-2 border-t border-[#F4EFEA] flex items-center justify-between">
                <span className="text-xs text-[#1A261C]/70 truncate max-w-[260px]">
                  {url}
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#B80D1D] hover:underline"
                >
                  <span>Open Link</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Screenshot Capture */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A261C]/80">
              Captured Screenshot
            </h4>
            {screenshotUrl ? (
              <div className="border border-[#F4EFEA] rounded-xl overflow-hidden bg-[#FAFAFC] shadow-inner">
                <img
                  src={screenshotUrl}
                  alt="Evidence Capture"
                  className="w-full h-auto object-contain max-h-[500px]"
                />
              </div>
            ) : (
              <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-8 text-center text-xs text-[#1A261C]/60 italic">
                No screenshot capture recorded for this evidence item.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F4EFEA] bg-[#FAFAFC] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1A261C] text-white text-xs font-semibold rounded-lg hover:bg-[#1A261C]/90 transition-all"
          >
            Close Evidence
          </button>
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/report/ExportPdfButton.tsx
````typescript
import React, { useState } from "react";
import { exportPdf } from "../../api/client";
import { Button } from "../common/Button";

interface ExportPdfButtonProps {
  reportId: string;
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({ reportId }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportPdf(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proofrent-report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert("Failed to export PDF report.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={exporting}>
      {exporting ? "Generating PDF..." : "Download PDF Report"}
    </Button>
  );
};
````

## File: src/components/report/FairPriceCard.tsx
````typescript
import type { FairPriceResult } from '../../types/api';

interface FairPriceCardProps {
  result: FairPriceResult;
}

export function FairPriceCard({ result }: FairPriceCardProps) {
  if (!result) return null;

  const res = result as any;
  const verdict = res.verdict || 'fair';
  const statedRent = res.stated_rent || res.statedRent || 0;
  const fairMin = res.fair_min || res.fairMin || 0;
  const fairMax = res.fair_max || res.fairMax || 0;
  const message = res.message || '';

  const verdictStyles =
    verdict === 'overpriced'
      ? { badgeBg: 'bg-[#B80D1D]', text: 'Overpriced vs Market', badgeText: 'text-white' }
      : verdict === 'great_deal'
      ? { badgeBg: 'bg-emerald-600', text: 'Great Deal', badgeText: 'text-white' }
      : { badgeBg: 'bg-[#1A261C]', text: 'Fair Price', badgeText: 'text-white' };

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F4EFEA]">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
            Algorithmic Benchmark
          </span>
          <h3 className="font-display font-extrabold text-lg text-[#1A261C]">
            Fair Market Valuation
          </h3>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${verdictStyles.badgeBg} ${verdictStyles.badgeText}`}
        >
          {verdictStyles.text}
        </span>
      </div>

      {/* Price Comparison Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]/50 block">
            Stated Rent Quote
          </span>
          <div className="font-display text-2xl font-extrabold text-[#1A261C] mt-1">
            ₹{Number(statedRent).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E9DEC3]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D] block">
            Estimated Fair Range
          </span>
          <div className="font-display text-lg font-extrabold text-[#B80D1D] mt-1">
            ₹{Number(fairMin).toLocaleString('en-IN')} – ₹{Number(fairMax).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
          <span className="text-base shrink-0">💡</span>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
````

## File: src/components/report/FindingCard.tsx
````typescript
import type { Finding, SourceRef } from '../../types/api';

interface FindingCardProps {
  finding: Finding;
  onOpenEvidence?: (source: SourceRef) => void;
}

export function FindingCard({ finding, onOpenEvidence }: FindingCardProps) {
  if (!finding) return null;

  const confidence = finding.confidence || 'medium';
  const confidenceColor =
    confidence === 'high'
      ? 'bg-[#B80D1D] text-white'
      : confidence === 'medium'
      ? 'bg-[#1A261C] text-white'
      : 'bg-[#F4EFEA] text-[#1A261C]';

  return (
    <div className="bg-white border-2 border-[#1A261C]/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-5">
      {/* Top Banner: Kind & Confidence */}
      <div className="flex items-center justify-between gap-3 border-b border-[#F4EFEA] pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B80D1D] animate-ping shrink-0" />
          <h4 className="text-base font-extrabold text-[#1A261C] tracking-tight">
            {finding.label || 'Verification Finding Discrepancy'}
          </h4>
        </div>
        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${confidenceColor}`}>
          {confidence} Confidence
        </span>
      </div>

      {/* Grid: What We Saw vs How Matched */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What We Saw */}
        {finding.what_we_saw && (
          <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
              🚨 Observed Discrepancy
            </span>
            <p className="text-xs text-[#1A261C] leading-relaxed font-medium">
              {finding.what_we_saw}
            </p>
          </div>
        )}

        {/* How We Matched */}
        {finding.how_we_matched && (
          <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]/60">
              🔍 Matching Methodology
            </span>
            <p className="text-xs text-[#1A261C]/80 leading-relaxed">
              {finding.how_we_matched}
            </p>
          </div>
        )}
      </div>

      {/* Innocent Explanations */}
      {finding.other_explanations && finding.other_explanations.length > 0 && (
        <div className="bg-[#F4EFEA]/40 border-l-4 border-[#1A261C] p-3.5 rounded-r-xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]">
            💡 Alternative Explanation
          </span>
          <p className="text-xs text-[#1A261C]/80 italic">
            "{finding.other_explanations[0]}"
          </p>
        </div>
      )}

      {/* Bottom Action: Question & Source Proof */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F4EFEA]">
        {finding.question && (
          <div className="text-xs text-[#1A261C] font-semibold flex items-center gap-2">
            <span className="text-[#B80D1D] font-mono font-bold">Ask:</span>
            <span>"{finding.question}"</span>
          </div>
        )}

        {finding.sources && finding.sources.length > 0 && onOpenEvidence && (
          <button
            type="button"
            onClick={() => onOpenEvidence(finding.sources![0])}
            className="text-xs font-bold text-white bg-[#1A261C] hover:bg-[#1A261C]/90 px-3.5 py-1.5 rounded-lg transition-colors shrink-0 self-start sm:self-auto"
          >
            View Evidence Proof ↗
          </button>
        )}
      </div>
    </div>
  );
}
````

## File: src/components/report/HighlightedText.tsx
````typescript
export function HighlightedText({
  text,
}: {
  text: string;
  sharedSentences?: string[];
}) {
  if (!text) return <span className="text-[#1A261C]/40 italic">No description provided</span>;

  return (
    <p className="text-xs text-[#1A261C] leading-relaxed whitespace-pre-line">
      {text}
    </p>
  );
}
````

## File: src/components/report/JobStreamFeed.tsx
````typescript
import React from "react";
import type { JobEvent } from "../../types/api";
import { Spinner } from "../common/Spinner";
import { Badge } from "../common/Badge";

interface JobStreamFeedProps {
  events: JobEvent[];
  isComplete: boolean;
}

export const JobStreamFeed: React.FC<JobStreamFeedProps> = ({ events, isComplete }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-lg">Live Investigation Progress</h3>
        <Badge tone={isComplete ? "green" : "blue"}>
          {isComplete ? "Analysis Complete" : "Investigating..."}
        </Badge>
      </div>

      {!isComplete && (
        <div className="flex items-center space-x-3 py-2 text-sm text-slate-600">
          <Spinner label="Running scrapers, cross-referencing portals, and analyzing cost ladder..." />
        </div>
      )}

      <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs max-h-60 overflow-y-auto space-y-2">
        {events.length === 0 ? (
          <p className="text-slate-400 italic">Initializing stream connection...</p>
        ) : (
          events.map((evt, idx) => (
            <div key={idx} className="flex items-start space-x-2 border-b border-slate-800/60 pb-1">
              <span className="text-slate-500">
                [{new Date((evt as { timestamp?: string }).timestamp || Date.now()).toLocaleTimeString()}]
              </span>
              <span className="text-blue-400 font-semibold">{evt.module || "SYSTEM"}:</span>
              <span className="text-slate-200">{evt.message || evt.type}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
````

## File: src/components/report/MapPinsView.tsx
````typescript
function formatDistance(m: number | null): string {
  if (m === null || m === undefined) return '—';
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

interface MapPinsViewProps {
  a: { lat: number | null; lng: number | null };
  b: { lat: number | null; lng: number | null };
  distanceM: number | null;
}

export function MapPinsView({ a, b, distanceM }: MapPinsViewProps) {
  const hasCoords = a.lat !== null && a.lng !== null && b.lat !== null && b.lng !== null;

  if (!hasCoords && distanceM === null) {
    return (
      <div className="bg-[#F4EFEA]/40 border border-[#F4EFEA] rounded-lg p-3 text-center text-xs text-[#1A261C]/60">
        Location coordinates unavailable for direct map comparison
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[#1A261C]">Pin Proximity</span>
        <span className="font-bold text-[#B80D1D] bg-[#B80D1D]/10 px-2 py-0.5 rounded">
          {formatDistance(distanceM)} apart
        </span>
      </div>

      <div className="relative h-2 bg-[#F4EFEA] rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 bg-[#1A261C] rounded-full transition-all"
          style={{
            width: distanceM !== null ? `${Math.min(100, Math.max(10, 100 - distanceM / 2))}%` : '50%',
          }}
        />
      </div>
    </div>
  );
}
````

## File: src/components/report/MatchSideBySide.tsx
````typescript
import type { ListingFields, UserDecision, SourceRef } from '../../types/api';
import { SignalChips } from './SignalChips';
import { PriceGapBadge } from './PriceGapBadge';
import { MapPinsView } from './MapPinsView';

function getText(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val.value !== undefined) return String(val.value);
  return '';
}

interface MatchSideBySideProps {
  listing: ListingFields;
  candidate: any;
  onDecision: (candidateId: string, d: UserDecision) => void;
  onOpenEvidence: (source: SourceRef) => void;
}

export function MatchSideBySide({ listing, candidate, onDecision, onOpenEvidence }: MatchSideBySideProps) {
  const currentDecision = candidate?.user_decision || 'unreviewed';

  const listingTitle = getText((listing as any)?.title) || 'Submitted Listing';
  const listingAddress = getText((listing as any)?.address) || '1.2 km from shared location';

  const candidateTitle = getText(candidate?.title) || 'Matched Listing Title';
  const candidateAddress = getText(candidate?.address) || '1.1 km from shared location';

  const listingImg = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
  const candidateImg = candidate?.screenshot_url || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-6">
      {/* Top Header & Decision Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F4EFEA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B80D1D] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#B80D1D]">
              Cross-Portal Duplicate Match
            </span>
          </div>
          <h3 className="font-display font-extrabold text-xl text-[#1A261C] mt-1">
            {candidateTitle}
          </h3>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#F4EFEA]">
          <button
            type="button"
            onClick={() => onDecision(candidate.candidate_id, 'confirm' as UserDecision)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              currentDecision === 'confirm'
                ? 'bg-[#1A261C] text-white shadow-sm'
                : 'text-[#1A261C]/70 hover:bg-[#F4EFEA]'
            }`}
          >
            ✓ Confirm Match
          </button>
          <button
            type="button"
            onClick={() => onDecision(candidate.candidate_id, 'reject' as UserDecision)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              currentDecision === 'reject'
                ? 'bg-[#B80D1D] text-white shadow-sm'
                : 'text-[#1A261C]/70 hover:bg-[#B80D1D]/10'
            }`}
          >
            ✕ Reject
          </button>
        </div>
      </div>

      {/* Signal Alignment Chips */}
      {candidate.family_results && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A261C]/50">
            Signal Family Alignment Audit
          </span>
          <SignalChips families={candidate.family_results} />
        </div>
      )}

      {/* Side-by-Side Property Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left Card: Target Listing */}
        <div className="bg-white rounded-3xl border border-[#F4EFEA] shadow-card overflow-hidden flex flex-col justify-between hover:border-[#B80D1D]/30 transition-all">
          <div>
            <div className="relative h-44 overflow-hidden">
              <img src={listingImg} alt={listingTitle} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#1A261C] text-[#FAF8F5] font-bold text-xs shadow-md border border-[#1A261C]/50 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Listed Subject</span>
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
                  Target Listing
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h4 className="font-display font-bold text-base text-[#1A261C]">{listingTitle}</h4>
                <p className="text-xs text-[#1A261C]/60 flex items-center mt-1">📍 {listingAddress}</p>
              </div>

              <div className="flex items-baseline justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA]">
                <div>
                  <span className="font-display text-2xl font-extrabold text-[#1A261C]">₹28,000</span>
                  <span className="text-xs text-[#1A261C]/60"> / mo</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#B80D1D]/10 text-[#B80D1D] text-[11px] font-bold">
                  Stated Rent
                </span>
              </div>

              {/* Itemized Cost Table */}
              <div className="pt-2 border-t border-[#F4EFEA] space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dashed border-[#F4EFEA]">
                  <span className="text-[#1A261C]/70">Maintenance Fee</span>
                  <span className="font-semibold text-[#1A261C]">₹1,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#F4EFEA]">
                  <span className="text-[#1A261C]/70">Security Deposit</span>
                  <span className="font-semibold text-[#1A261C]">₹56,000</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#F4EFEA] via-[#FAF8F5] to-[#F4EFEA] border border-[#E9DEC3] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#B80D1D] uppercase tracking-wider block">Real Monthly Cost</span>
                  <span className="text-xs text-[#1A261C]/60">All Included</span>
                </div>
                <div className="font-display text-xl font-extrabold text-[#B80D1D]">₹29,000</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Matched Duplicate */}
        <div className="bg-white rounded-3xl border border-[#F4EFEA] shadow-card overflow-hidden flex flex-col justify-between hover:border-[#B80D1D]/30 transition-all">
          <div>
            <div className="relative h-44 overflow-hidden">
              <img src={candidateImg} alt={candidateTitle} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#B80D1D] to-[#8B0000] text-white font-bold text-xs shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                <span>Matched Portal</span>
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
                  {candidate.source_platform || 'External Portal'}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h4 className="font-display font-bold text-base text-[#1A261C]">{candidateTitle}</h4>
                <p className="text-xs text-[#1A261C]/60 flex items-center mt-1">📍 {candidateAddress}</p>
              </div>

              <div className="flex items-baseline justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA]">
                <div>
                  <span className="font-display text-2xl font-extrabold text-[#1A261C]">₹24,000</span>
                  <span className="text-xs text-[#1A261C]/60"> / mo</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  ₹4,000 Cheaper
                </span>
              </div>

              {/* Itemized Cost Table */}
              <div className="pt-2 border-t border-[#F4EFEA] space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dashed border-[#F4EFEA]">
                  <span className="text-[#1A261C]/70">Maintenance Fee</span>
                  <span className="font-semibold text-[#1A261C]">₹1,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#F4EFEA]">
                  <span className="text-[#1A261C]/70">Security Deposit</span>
                  <span className="font-semibold text-[#1A261C]">₹48,000</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#F4EFEA] via-[#FAF8F5] to-[#F4EFEA] border border-[#E9DEC3] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#B80D1D] uppercase tracking-wider block">Real Monthly Cost</span>
                  <span className="text-xs text-[#1A261C]/60">All Included</span>
                </div>
                <div className="font-display text-xl font-extrabold text-[#B80D1D]">₹25,000</div>
              </div>
            </div>
          </div>

          <div className="p-5 pt-0">
            {candidate.url && (
              <button
                type="button"
                onClick={() => onOpenEvidence({ url: candidate.url, platform: candidate.source_platform } as any)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#B80D1D] text-[#B80D1D] hover:bg-[#B80D1D] hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>View Full Listing Evidence</span>
                <span>↗</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {candidate.price_gaps && candidate.price_gaps.length > 0 && (
        <PriceGapBadge gaps={candidate.price_gaps} />
      )}

      {((listing as any)?.lat || candidate?.lat) && (
        <MapPinsView
          a={{ lat: ((listing as any)?.lat as any)?.value ?? (listing as any)?.lat ?? null, lng: ((listing as any)?.lng as any)?.value ?? (listing as any)?.lng ?? null }}
          b={{ lat: candidate?.lat ?? null, lng: candidate?.lng ?? null }}
          distanceM={candidate?.distance_m ?? null}
        />
      )}
    </div>
  );
}
````

## File: src/components/report/ModuleBlock.tsx
````typescript
import { useState, type ReactNode } from 'react';

interface ModuleBlockProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ModuleBlock({
  title,
  subtitle,
  badge,
  children,
  defaultOpen = true,
}: ModuleBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="bg-white border border-[#F4EFEA] rounded-3xl shadow-luxury overflow-hidden transition-all">
      {/* Clean White & Deep Olive Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left bg-white border-b border-[#F4EFEA] hover:bg-[#FAF8F5] transition-colors focus:outline-none"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-extrabold text-xl text-[#1A261C] tracking-tight">
              {title}
            </h2>
            {badge && (
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#B80D1D]/10 text-[#B80D1D] border border-[#B80D1D]/20 px-3 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#1A261C]/60 font-medium">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-[#1A261C]/60 shrink-0 ml-4">
          <span className="text-xs font-bold uppercase tracking-wider">
            {isOpen ? 'Minimize' : 'Expand'}
          </span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && <div className="p-6 bg-[#FAFAFC]">{children}</div>}
    </section>
  );
}
````

## File: src/components/report/PriceGapBadge.tsx
````typescript
import type { PriceGap } from '../../types/api';

function formatRupees(n: number | null): string {
  if (n === null || n === undefined) return '—';
  return `₹${n.toLocaleString('en-IN')}`;
}

export function PriceGapBadge({ gaps }: { gaps: PriceGap[] }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {gaps.map((gap, idx) => {
        const isDiff = gap.difference !== 0;
        const higherHere = gap.difference < 0;

        return (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 bg-[#FAFAFC] border border-[#F4EFEA] p-2.5 rounded-lg text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#1A261C] capitalize">
                {gap.sharing_type} room {gap.ac ? '(AC)' : ''}
              </span>
              <span className="text-[#1A261C]/60">
                {formatRupees(gap.rent_here)} vs {formatRupees(gap.rent_there)}
              </span>
            </div>

            {gap.comparable ? (
              <span
                className={`font-bold px-2 py-0.5 rounded text-xs ${
                  isDiff
                    ? higherHere
                      ? 'bg-[#B80D1D]/10 text-[#B80D1D] border border-[#B80D1D]/30'
                      : 'bg-[#1A261C]/10 text-[#1A261C] border border-[#1A261C]/30'
                    : 'bg-[#F4EFEA] text-[#1A261C]'
                }`}
              >
                {gap.difference > 0
                  ? `+${formatRupees(gap.difference)} gap`
                  : gap.difference < 0
                  ? `${formatRupees(gap.difference)} gap`
                  : 'Same price'}
              </span>
            ) : (
              <span className="text-[11px] text-[#1A261C]/60 italic">
                {gap.note || 'Shown as stated'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
````

## File: src/components/report/QuestionsList.tsx
````typescript
import { useState } from 'react';

interface QuestionsListProps {
  questions: any[];
}

export function QuestionsList({ questions }: QuestionsListProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-5 text-center text-xs text-[#1A261C]/60">
        No specific questions generated for this listing.
      </div>
    );
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B80D1D]">
            Tenant Guidance
          </span>
          <h3 className="text-base font-bold text-[#1A261C]">
            Suggested Questions for Landlord / Broker
          </h3>
        </div>
        <span className="text-xs font-semibold bg-[#F4EFEA] text-[#1A261C] px-2.5 py-1 rounded-md">
          {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((q: any, idx: number) => {
          const qText = typeof q === 'string' ? q : q?.question || q?.text || '';
          const qReason = typeof q === 'object' ? q?.reason || q?.why : null;
          const qCategory = typeof q === 'object' ? q?.category || q?.kind : null;

          return (
            <div
              key={idx}
              className="bg-white border border-[#F4EFEA] rounded-lg p-4 space-y-2 hover:border-[#1A261C]/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  {qCategory && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#F4EFEA] text-[#1A261C]/70 px-2 py-0.5 rounded">
                      {qCategory}
                    </span>
                  )}
                  <p className="text-xs font-bold text-[#1A261C] leading-relaxed">
                    "{qText}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(qText, idx)}
                  className="shrink-0 text-[11px] font-semibold text-[#B80D1D] bg-[#B80D1D]/10 hover:bg-[#B80D1D]/20 px-2.5 py-1 rounded transition-colors"
                >
                  {copiedIdx === idx ? '✓ Copied' : 'Copy Question'}
                </button>
              </div>

              {qReason && (
                <p className="text-[11px] text-[#1A261C]/70 italic border-l-2 border-[#F4EFEA] pl-2">
                  Why ask: {qReason}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
````

## File: src/components/report/RedStringView.tsx
````typescript
import type { ListingFields, MatchingResult, UserDecision, SourceRef } from '../../types/api';
import { FindingCard } from './FindingCard';
import { MatchSideBySide } from './MatchSideBySide';

interface RedStringViewProps {
  listing: ListingFields;
  matching: MatchingResult;
  onDecision: (candidateId: string, d: UserDecision) => void;
  onOpenEvidence?: (source: SourceRef) => void;
}

export function RedStringView({ listing, matching, onDecision, onOpenEvidence }: RedStringViewProps) {
  const handleOpenEvidence = (source: SourceRef) => {
    if (onOpenEvidence) {
      onOpenEvidence(source);
    }
  };

  const candidates = matching?.candidates || [];
  const findings: any[] = (matching as any)?.findings || [];

  return (
    <div className="space-y-6">
      {/* Candidates List */}
      {candidates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A261C]/80">
            Matched Property Candidates ({candidates.length})
          </h3>
          <div className="space-y-4">
            {candidates.map((cand: any) => (
              <MatchSideBySide
                key={cand.candidate_id}
                listing={listing}
                candidate={cand}
                onDecision={onDecision}
                onOpenEvidence={handleOpenEvidence}
              />
            ))}
          </div>
        </div>
      )}

      {/* Findings Section */}
      {findings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A261C]/80">
            Key Verification Findings ({findings.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {findings.map((f: any, idx: number) => (
              <FindingCard
                key={idx}
                finding={f}
                onOpenEvidence={handleOpenEvidence}
              />
            ))}
          </div>
        </div>
      )}

      {candidates.length === 0 && findings.length === 0 && (
        <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-8 text-center text-xs text-[#1A261C]/60">
          No red string matches or findings detected for this listing.
        </div>
      )}
    </div>
  );
}
````

## File: src/components/report/ReportView.tsx
````typescript
import { useState } from 'react';
import type { UserDecision, SourceRef } from '../../types/api';
import { RedStringView } from './RedStringView';
import { CostLadderView } from './CostLadderView';
import { FairPriceCard } from './FairPriceCard';
import { QuestionsList } from './QuestionsList';
import { EvidenceDrawer } from './EvidenceDrawer';
import { ModuleBlock } from './ModuleBlock';
import { ShareBar } from './ShareBar';

interface ReportViewProps {
  report: any;
  onRefetch?: () => void;
}

export function ReportView({ report, onRefetch }: ReportViewProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<SourceRef | null>(null);

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-xs text-[#1A261C]/60 bg-[#FAFAFC] rounded-2xl border border-[#F4EFEA]">
        No report data available.
      </div>
    );
  }

  const listing = report.listing || {};
  const matching = report.matching || {};
  const costLadder = report.cost_ladder || null;
  const fairPrice = report.fair_price || null;
  const questions = report.questions || [];

  const handleUserDecision = (candidateId: string, decision: UserDecision) => {
    console.log(`User decision for candidate ${candidateId}: ${decision}`);
    if (onRefetch) {
      onRefetch();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner & Share Bar */}
      <ShareBar report={report} />

      {/* Hero 1: Listing & Red String Verification Matches */}
      <ModuleBlock
        title="Verification & Duplicate Detection"
        subtitle="Cross-platform listing analysis, image verification, and red string matches"
        badge={matching?.candidates?.length ? `${matching.candidates.length} Matches` : undefined}
      >
        <RedStringView
          listing={listing}
          matching={matching}
          onDecision={handleUserDecision}
          onOpenEvidence={(src) => setSelectedEvidence(src)}
        />
      </ModuleBlock>

      {/* Hero 2: Financial Assessment (Cost Ladder & Fair Price) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {costLadder && (
          <ModuleBlock
            title="Move-in Cost Ladder"
            subtitle="Full 1st-month deposit, rent, and hidden fee audit"
          >
            <CostLadderView
              ladder={costLadder}
              onOpenEvidence={(src) => setSelectedEvidence(src)}
            />
          </ModuleBlock>
        )}

        {fairPrice && (
          <ModuleBlock
            title="Fair Market Valuation"
            subtitle="Algorithmic rent estimation against localized market benchmarks"
          >
            <FairPriceCard result={fairPrice} />
          </ModuleBlock>
        )}
      </div>

      {/* Hero 3: Suggested Questions for Negotiation */}
      {questions.length > 0 && (
        <ModuleBlock
          title="Tenant Negotiation Playbook"
          subtitle="Targeted questions based on listing discrepancies and fee disclosures"
        >
          <QuestionsList questions={questions} />
        </ModuleBlock>
      )}

      {/* Evidence Slide-Over Drawer */}
      <EvidenceDrawer
        source={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}
````

## File: src/components/report/ShareBar.tsx
````typescript
import { useState } from 'react';

interface ShareBarProps {
  report: any;
}

export function ShareBar({ report }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const sharePath = report?.share_path || window.location.pathname;
  const fullUrl = `${window.location.origin}${sharePath}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#1A261C] text-white rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap shadow-lg border border-[#1A261C]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <span className="text-base">🛡️</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F4EFEA]">
              ProofRent Verified Audit
            </h4>
            <span className="text-[9px] font-mono font-semibold bg-[#B80D1D] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              Immutable Report
            </span>
          </div>
          <p className="text-xs text-[#F4EFEA]/80 mt-0.5">
            Cross-platform signals verified. Share with landlord or co-tenants for transparent negotiation.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleCopyLink}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all active:scale-95"
        >
          {copied ? '✓ Link Copied' : '🔗 Share Audit Link'}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-[#B80D1D] hover:bg-[#B80D1D]/90 text-white shadow-md transition-all active:scale-95"
        >
          📄 Export PDF Report
        </button>
      </div>
    </div>
  );
}
````

## File: src/components/report/SignalChips.tsx
````typescript
interface SignalFamilyResult {
  family: string;
  agreed: boolean;
  detail?: string;
}

interface SignalChipsProps {
  families: SignalFamilyResult[];
}

const FAMILY_LABELS: Record<string, string> = {
  location: 'Geo Proximity',
  identity: 'Name & Contact',
  content: 'Text Similarity',
  visual: 'Photo Fingerprint',
};

export function SignalChips({ families }: SignalChipsProps) {
  if (!families || families.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {families.map((fam, idx) => {
        const label = FAMILY_LABELS[fam.family] || fam.family;
        const matched = fam.agreed;

        return (
          <div
            key={idx}
            title={fam.detail}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border transition-all ${
              matched
                ? 'bg-[#1A261C]/5 text-[#1A261C] border-[#1A261C]/20'
                : 'bg-[#B80D1D]/5 text-[#B80D1D] border-[#B80D1D]/25'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                matched ? 'bg-[#1A261C]' : 'bg-[#B80D1D]'
              }`}
            />
            <span>{label}</span>
            <span className="opacity-60 text-[10px]">
              {matched ? '✓' : '✕'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
````

## File: src/hooks/useInvestigationStream.ts
````typescript
import { useEffect, useState } from "react";
import { getReport } from "@/api/client";
import type { Report, JobEvent } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function useInvestigationStream(reportId: string | undefined) {
  const [report, setReport] = useState<Report | null>(null);
  const [events, setEvents] = useState<JobEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;

    let isMounted = true;

    // Initial report fetch
    getReport(reportId)
      .then((data) => {
        if (isMounted) {
          setReport(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load report.");
          setLoading(false);
        }
      });

    // Connect Server-Sent Events stream
    const eventSource = new EventSource(`${BASE_URL}/api/investigations/${reportId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const jobEvent = JSON.parse(event.data) as JobEvent;
        if (isMounted) {
          setEvents((prev) => [...prev, jobEvent]);

          // Refresh full report on completion or module milestones
          if (jobEvent.type === "completed" || jobEvent.type === "module_ready") {
            getReport(reportId).then((updated) => {
              if (isMounted) setReport(updated);
            });
          }
        }
      } catch {
        // Handle stream parse ignore
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      isMounted = false;
      eventSource.close();
    };
  }, [reportId]);

  return { report, events, loading, error, setReport };
}
````

## File: src/pages/HomePage.tsx
````typescript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ListingInput } from '../components/home/ListingInput';

export function HomePage() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyzeUrl = (_url: string) => {
    setAnalyzing(true);

    // Simulate AI extraction delay then route directly to the audit report
    setTimeout(() => {
      setAnalyzing(false);
      navigate('/report/demo');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col justify-between">
      {/* Top Header Navigation */}
      <header className="h-20 bg-white/90 backdrop-blur-md border-b border-[#F4EFEA] px-6 lg:px-12 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B0000] via-[#B80D1D] to-[#C80D2E] flex items-center justify-center text-white shadow-red-glow">
            <span className="text-lg">🏰</span>
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-[#1A261C]">
              Proof<span className="text-[#B80D1D]">Rent</span>
            </span>
            <p className="text-[10px] font-bold tracking-wide uppercase text-[#1A261C]/50">
              Real Rental Verification Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/report/demo"
            className="text-xs font-bold text-[#1A261C] hover:bg-[#F4EFEA] border border-[#F4EFEA] px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Explore Demo Audit ↗
          </Link>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 space-y-12">
        {/* Hero Banner Section */}
        <section className="relative rounded-3xl bg-gradient-to-r from-white via-[#FAF8F5] to-[#F4EFEA]/60 border border-[#F4EFEA] p-8 lg:p-12 shadow-luxury overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B80D1D]/10 border border-[#B80D1D]/20 text-[#B80D1D] text-xs font-bold tracking-wide">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B80D1D] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B80D1D]" />
                </span>
                <span>AI Rent Truth Engine v3.4</span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-extrabold text-[#1A261C] font-display tracking-tight leading-tight">
                Find the real cost behind <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#B80D1D] via-[#C80D2E] to-[#8B0000] bg-clip-text text-transparent">
                  any rental listing.
                </span>
              </h1>

              <p className="text-[#1A261C]/70 text-sm sm:text-base max-w-2xl leading-relaxed">
                Paste a PG or rental property URL. ProofRent instantly cross-references platforms, detects duplicate listings, calculates hidden move-in fees, and benchmarks fair prices.
              </p>

              {/* Listing Input Bar */}
              <div className="pt-2">
                <ListingInput onSubmit={handleAnalyzeUrl} busy={analyzing} />
              </div>
            </div>

            {/* Right Hero Graphic Box */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs aspect-square rounded-3xl bg-gradient-to-tr from-[#F4EFEA] via-white to-[#FAF8F5] p-6 border border-[#E9DEC3] shadow-luxury flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B80D1D]" />
                    <span className="text-xs font-bold text-[#1A261C]">Evidence Scraper</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Live Engine
                  </span>
                </div>

                <div className="my-4 text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1A261C] text-white flex items-center justify-center text-2xl shadow-md">
                    🛡️
                  </div>
                  <h4 className="font-display font-bold text-sm text-[#1A261C]">
                    Immutable Risk Audit
                  </h4>
                  <p className="text-[11px] text-[#1A261C]/60">
                    Perceptual image matching across 14+ rental portals
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[#F4EFEA] text-[#1A261C]/60">
                  <span>Match Confidence</span>
                  <span className="font-extrabold text-[#1A261C]">98.4%</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-[#F4EFEA] shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#B80D1D] flex items-center justify-center font-bold text-lg">
              🔍
            </div>
            <h3 className="font-bold text-sm text-[#1A261C]">Compare Listings</h3>
            <p className="text-xs text-[#1A261C]/60">Identify price disparities and duplicate posts across portals.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F4EFEA] shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#1A261C] flex items-center justify-center font-bold text-lg">
              🛡️
            </div>
            <h3 className="font-bold text-sm text-[#1A261C]">Check Evidence</h3>
            <p className="text-xs text-[#1A261C]/60">Inspect verified screenshots and original source links.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F4EFEA] shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#B80D1D] flex items-center justify-center font-bold text-lg">
              🧾
            </div>
            <h3 className="font-bold text-sm text-[#1A261C]">Real Breakdown</h3>
            <p className="text-xs text-[#1A261C]/60">Uncover hidden maintenance, deposit, and move-in fees.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F4EFEA] shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#1A261C] flex items-center justify-center font-bold text-lg">
              🤝
            </div>
            <h3 className="font-bold text-sm text-[#1A261C]">Informed Decisions</h3>
            <p className="text-xs text-[#1A261C]/60">Negotiate transparently with co-tenants and landlords.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#1A261C]/50 border-t border-[#F4EFEA]">
        <p>© 2026 ProofRent Technologies Inc. • Premium Rental Verification Platform</p>
      </footer>
    </div>
  );
}
````

## File: src/pages/PreflightPage.tsx
````typescript
import React, { useEffect, useState } from "react";
import { getPreflight } from "@/api/client";
import type { PreflightResult } from "@/types/api";
import { Badge } from "@/components/common/Badge";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/common/Button";

export const PreflightPage: React.FC = () => {
  const [data, setData] = useState<PreflightResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPreflight();
      setData(res);
    } catch {
      setError("Failed to fetch preflight status from backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Preflight Status</h1>
          <p className="text-sm text-slate-500">Live health check of scrapers, extractors, and backend services</p>
        </div>
        <Button variant="outline" onClick={checkStatus} disabled={loading}>
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Spinner label="Checking system health..." />
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-medium">
          {error}
        </div>
      )}

      {!loading && data && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Overall Status</span>
            <Badge tone={data.all_ok ? "green" : "red"}>
              {data.all_ok ? "All Systems Operational" : "Degraded / Offline"}
            </Badge>
          </div>
          <ul className="divide-y divide-slate-100">
            {data.checks.map((check, idx) => (
              <li key={idx} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{check.name}</p>
                  <p className="text-xs text-slate-500">{check.detail}</p>
                </div>
                <Badge tone={check.ok ? "green" : "red"}>{check.ok ? "OK" : "FAIL"}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
````

## File: src/pages/ReportPage.tsx
````typescript
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReportView } from '../components/report/ReportView';

// Rich mock fallback data for instant browser testing
const MOCK_REPORT_DATA = {
  report_id: 'demo-report-101',
  share_path: '/report/demo-report-101',
  listing: {
    title: { value: 'Green Valley Luxury 2BHK Apartment' },
    address: { value: '123 Koramangala 4th Block, Bengaluru' },
    description: 'Spacious 2BHK with fully furnished amenities, modular kitchen, and balcony.',
    lat: 12.9352,
    lng: 77.6245,
  },
  matching: {
    candidates: [
      {
        candidate_id: 'cand_101',
        title: 'Green Valley 2BHK Flat / PG',
        source_platform: 'NoBroker',
        url: 'https://nobroker.in/example-listing',
        screenshot_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        user_decision: 'unreviewed',
        lat: 12.9355,
        lng: 77.6248,
        distance_m: 45,
        family_results: [
          { family: 'location', agreed: true, detail: 'Coordinates within 50m radius' },
          { family: 'identity', agreed: true, detail: 'Matching property name & owner phone' },
          { family: 'content', agreed: false, detail: 'Rent amount listed differently' },
          { family: 'visual', agreed: true, detail: 'Photo signatures match with 94% confidence' },
        ],
        price_gaps: [
          {
            sharing_type: '2BHK Entire Flat',
            ac: true,
            rent_here: 28000,
            rent_there: 24000,
            difference: -4000,
            comparable: true,
          },
        ],
      },
    ],
    findings: [
      {
        kind: 'price_mismatch',
        label: 'Price Discrepancy',
        confidence: 'high',
        what_we_saw: 'Identical property photos listed on NoBroker for ₹24,000/month (₹4,000 lower).',
        how_we_matched: 'Perceptual photo hashing & geo-proximity alignment.',
        other_explanations: ['Owner may have listed via a third-party broker who added commission markup.'],
        question: 'Is the ₹28,000 rent rate negotiable to match the direct owner listing of ₹24,000?',
        sources: [
          {
            url: 'https://nobroker.in/example-listing',
            platform: 'NoBroker',
          },
        ],
      },
    ],
  },
  cost_ladder: {
    headline: 'Move-in & Monthly Financial Obligations',
    total_first_month: 87500,
    monthly_recurring: 28000,
    items: [
      { label: 'Monthly Base Rent', amount: 28000, is_hidden_cost: false },
      { label: 'Security Deposit (2 Months)', amount: 56000, is_hidden_cost: false },
      { label: 'Mandatory Agreement & Move-in Fee', amount: 3500, is_hidden_cost: true, note: 'Disclosed only at lease signing' },
    ],
  },
  fair_price: {
    verdict: 'overpriced',
    stated_rent: 28000,
    fair_min: 22000,
    fair_max: 25000,
    message: 'This property is listed ~12% above localized market benchmarks for Koramangala 4th Block.',
    confidence: 'high',
  },
  questions: [
    {
      question: 'Are maintenance fees and water charges included in the base rent quote or billed extra?',
      category: 'Fee Transparency',
      reason: 'Additional maintenance costs can increase monthly expenses by 10-15%.',
    },
    {
      question: 'Is the security deposit refundable in full within 15 days of lease termination?',
      category: 'Deposit Terms',
      reason: 'Prevents unexpected deduction clauses upon departure.',
    },
  ],
};

export function ReportPage() {
  const { report_id } = useParams<{ report_id: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/reports/${report_id || 'demo'}`);
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      console.warn('Backend API unreachable or endpoint not found. Loading demo mock data:', err.message);
      setReport(MOCK_REPORT_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [report_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#F4EFEA] border-t-[#B80D1D] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#1A261C]">Loading ProofRent Audit...</p>
        <p className="text-xs text-[#1A261C]/60 mt-1">Cross-referencing multi-platform listing records & price models</p>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="bg-[#B80D1D]/10 text-[#B80D1D] p-5 rounded-2xl border border-[#B80D1D]/20 max-w-md shadow-sm">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider">Report Load Failure</h2>
          <p className="text-xs mt-1.5">{error}</p>
        </div>
        <Link
          to="/"
          className="text-xs font-bold text-[#1A261C] hover:underline"
        >
          ← Return to Search
        </Link>
      </div>
    );
  }

  const isComplete = report.status === "completed" || report.status === "failed";
  
  // Safe field extractions to handle type schema variations cleanly
  const listingAny = report.listing as any;
  const rentPrice = listingAny?.rent_price?.value ?? listingAny?.price?.value ?? listingAny?.rent?.value;
  const rawTimestamp = (report as any).created_at || (report as any).captured_at || (report as any).timestamp;

  return (
    <div className="min-h-screen bg-[#FAFAFC] p-4 sm:p-6 lg:p-8">
      {/* Top Navigation & Audit Header */}
      <header className="max-w-5xl mx-auto mb-8 flex items-center justify-between border-b border-[#F4EFEA] pb-5">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs font-bold text-[#1A261C] hover:bg-[#F4EFEA] bg-white border border-[#F4EFEA] px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>←</span> Back
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]/50">
                Audit Record:
              </span>
              <span className="text-[11px] font-mono font-bold text-[#B80D1D] bg-[#B80D1D]/5 border border-[#B80D1D]/20 px-2 py-0.5 rounded-md">
                {report_id || report?.report_id || 'DEMO'}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-[#1A261C] tracking-tight mt-0.5">
              Property Verification & Risk Audit
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchReport}
          className="text-xs font-bold text-[#B80D1D] bg-[#B80D1D]/10 hover:bg-[#B80D1D]/20 border border-[#B80D1D]/20 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
        >
          <span>↻</span> Refresh Analysis
        </button>
      </header>

      {/* Main Verification Dashboard */}
      <main>
        <ReportView report={report} onRefetch={fetchReport} />
      </main>
    </div>
  );
}
````

## File: src/types/api.ts
````typescript
export type PortalId = "magicbricks" | "pgdekho" | "nobroker" | "housing" | "gopgo" | "hexahome" | "ninetynineacres";
export type EvidenceLabel = "verified" | "inferred" | "uncertain" | "unknown";
export type Confidence = "high" | "medium" | "low";
export type SharingType = "single" | "double" | "triple" | "quad" | "other";
export type ListingStatus = "live" | "removed" | "unknown";
export type SignalFamily = "location" | "identity" | "content" | "visual";
export type MatchLevel = "match" | "possible";
export type MatchScope = "same_place" | "same_operator_branch";
export type MatchStatus = "match_found" | "possible_match" | "several_candidates" | "no_match" | "not_checked";
export type PortalCheckStatus = "checked" | "blocked" | "failed" | "skipped" | "unsupported";
export type UserDecision = "confirmed" | "rejected";
export type CostKey = "rent" | "deposit" | "food" | "electricity" | "ac" | "maintenance" | "brokerage" | "notice_period" | "lock_in";
export type CostLabel = "listed" | "assumed" | "unknown";
export type Recurrence = "monthly" | "one_time" | "terms";
export type LadderStatus = "ok" | "rent_missing" | "failed";
export type PricePosition = "below" | "near" | "above";
export type FairPriceStatus = "ok" | "not_enough_data";
export type FindingKind = "same_place" | "cost" | "fair_price" | "listing_status";
export type ModuleName = "listing" | "matching" | "cost" | "fair_price" | "questions";
export type ModuleStatus = "pending" | "working" | "success" | "partial" | "empty" | "failed" | "not_checked";
export type JobStatus = "queued" | "running" | "completed" | "partial" | "failed";
export type JobEventType = "started" | "step" | "stream_url" | "module_ready" | "warning" | "heartbeat" | "completed" | "failed";
export type ExampleId = "match" | "no_match" | "hidden_fees" | "blocked";
export type Scalar = string | number | boolean;

export interface ApiError { code: string; message: string; next_step: string | null }
export interface ErrorResponse { error: ApiError }
export interface SourceRef { url: string; portal: PortalId | null; captured_at: string; snapshot_id: string | null }
export interface ExtractedValue { value: Scalar | null; passage: string | null }
export interface RentOption {
  sharing_type: SharingType; ac: boolean | null; monthly_rent: number | null;
  per_bed_stated: boolean | null; passage: string | null;
}
export interface ListingFields {
  listing_id: string; source: SourceRef; portal: PortalId; status: ListingStatus;
  title: ExtractedValue; operator_name: ExtractedValue; address_text: ExtractedValue; locality: ExtractedValue;
  description: ExtractedValue; gender_policy: ExtractedValue; food_plan: ExtractedValue; furnishing: ExtractedValue;
  floor: ExtractedValue; lat: number | null; lng: number | null; rent_options: RentOption[];
  deposit_amount: ExtractedValue; deposit_months: ExtractedValue; maintenance_monthly: ExtractedValue;
  electricity_terms: ExtractedValue; electricity_monthly: ExtractedValue; ac_charge_monthly: ExtractedValue;
  food_charge_monthly: ExtractedValue; brokerage_amount: ExtractedValue; brokerage_months: ExtractedValue;
  notice_period_days: ExtractedValue; lock_in_months: ExtractedValue;
  amenities: string[]; photo_urls: string[]; posted_on: string | null;
}
export interface FamilyResult { family: SignalFamily; agreed: boolean | null; detail: string }
export interface PriceGap {
  sharing_type: SharingType; ac: boolean | null; rent_here: number; rent_there: number;
  difference: number; comparable: boolean; note: string | null;
}
export interface MatchCandidate {
  candidate_id: string; listing: ListingFields; scope: MatchScope; match_level: MatchLevel; confidence: Confidence;
  method: string; families: FamilyResult[]; shared_sentences: string[]; distance_m: number | null;
  price_gaps: PriceGap[]; alternative_explanations: string[]; user_decision: UserDecision | null;
}
export interface PortalCheck { portal: PortalId; status: PortalCheckStatus; listings_seen: number; note: string | null; url: string | null }
export interface MatchingResult {
  status: MatchStatus; candidates: MatchCandidate[]; portals_checked: PortalCheck[];
  nearby_listings_count: number; message: string;
}
export interface CostLine {
  key: CostKey; title: string; label: CostLabel; recurrence: Recurrence;
  amount_min: number | null; amount_max: number | null; source: SourceRef | null; passage: string | null;
  assumption_text: string | null; question: string | null; display_value: string | null;
}
export interface CostLadder {
  status: LadderStatus; rent_option_index: number; sharing_type: SharingType | null; lines: CostLine[];
  monthly_min: number | null; monthly_max: number | null; move_in_min: number | null; move_in_max: number | null;
  unknown_count: number; headline: string;
}
export interface FairPriceResult {
  status: FairPriceStatus; comparable_count: number; sharing_type: SharingType | null;
  median_rent: number | null; listing_rent: number | null; position: PricePosition | null; message: string;
}
export interface QuestionItem { question_id: string; text: string; finding_id: string | null; is_default: boolean }
export interface Finding {
  finding_id: string; kind: FindingKind; what_we_saw: string; sources: SourceRef[];
  how_we_matched: string | null; confidence: Confidence | null; other_explanations: string[];
  label: EvidenceLabel; question: string | null;
}
export interface ModuleState { name: ModuleName; status: ModuleStatus; message: string | null; next_step: string | null }
export interface Report {
  report_id: string; status: JobStatus; created_at: string; captured_at: string | null;
  is_cached: boolean; is_replay: boolean; replay_label: string | null; input_url: string; portal: PortalId | null;
  listing: ListingFields | null; matching: MatchingResult | null; cost: CostLadder | null;
  fair_price: FairPriceResult | null; questions: QuestionItem[]; findings: Finding[];
  modules: ModuleState[]; share_path: string;
}
export interface InvestigateRequest { url: string | null; replay_example_id: ExampleId | null; force_refresh: boolean }
export interface InvestigateResponse { report_id: string; cached: boolean; is_replay: boolean }
export interface DecisionRequest { candidate_id: string; decision: UserDecision }
export interface ExampleListing { example_id: ExampleId; title: string; description: string; url: string; portal: PortalId }
export interface JobEvent {
  report_id: string; type: JobEventType; ts: string; message: string; module: ModuleName | null;
  portal: PortalId | null; stream_url: string | null; screenshot_url: string | null;
  progress: number | null; error: ApiError | null;
}
export interface PreflightCheck { name: string; ok: boolean; detail: string }
export interface PreflightResult { all_ok: boolean; checked_at: string; checks: PreflightCheck[] }
````

## File: src/App.css
````css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}
````

## File: src/App.tsx
````typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ReportPage } from './pages/ReportPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page with hero input */}
        <Route path="/" element={<HomePage />} />

        {/* Route for verification reports */}
        <Route path="/report/:report_id" element={<ReportPage />} />

        {/* Fallbacks */}
        <Route path="/report" element={<Navigate to="/report/demo" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
````

## File: src/index.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;
:root {
  --text: #6b6375;
  --text-h: #08060d;
  --bg: #fff;
  --border: #e5e4e7;
  --code-bg: #f4f3ec;
  --accent: #aa3bff;
  --accent-bg: rgba(170, 59, 255, 0.1);
  --accent-border: rgba(170, 59, 255, 0.5);
  --social-bg: rgba(244, 243, 236, 0.5);
  --shadow:
    rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;

  --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
  --heading: system-ui, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, Consolas, monospace;

  font: 18px/145% var(--sans);
  letter-spacing: 0.18px;
  color-scheme: light dark;
  color: var(--text);
  background: var(--bg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 1024px) {
    font-size: 16px;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: #9ca3af;
    --text-h: #f3f4f6;
    --bg: #16171d;
    --border: #2e303a;
    --code-bg: #1f2028;
    --accent: #c084fc;
    --accent-bg: rgba(192, 132, 252, 0.15);
    --accent-border: rgba(192, 132, 252, 0.5);
    --social-bg: rgba(47, 48, 58, 0.5);
    --shadow:
      rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
  }

  #social .button-icon {
    filter: invert(1) brightness(2);
  }
}

#root {
  width: 1126px;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  border-inline: 1px solid var(--border);
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

body {
  margin: 0;
}

h1,
h2 {
  font-family: var(--heading);
  font-weight: 500;
  color: var(--text-h);
}

h1 {
  font-size: 56px;
  letter-spacing: -1.68px;
  margin: 32px 0;
  @media (max-width: 1024px) {
    font-size: 36px;
    margin: 20px 0;
  }
}
h2 {
  font-size: 24px;
  line-height: 118%;
  letter-spacing: -0.24px;
  margin: 0 0 8px;
  @media (max-width: 1024px) {
    font-size: 20px;
  }
}
p {
  margin: 0;
}

code,
.counter {
  font-family: var(--mono);
  display: inline-flex;
  border-radius: 4px;
  color: var(--text-h);
}

code {
  font-size: 15px;
  line-height: 135%;
  padding: 4px 8px;
  background: var(--code-bg);
}
````

## File: src/main.tsx
````typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
````

## File: .gitignore
````
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
````

## File: eslint.config.js
````javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
````

## File: index.html
````html
<!doctype html>
<html lang="en" class="h-full bg-[#FAFAFC]">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ProofRent — Premium Rental Cost Dashboard</title>

    <!-- Google Fonts: Plus Jakarta Sans & Space Grotesk -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap"
      rel="stylesheet"
    />

    <!-- FontAwesome Icons -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
  </head>
  <body class="h-full bg-[#FAFAFC] text-[#1A261C] font-sans antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: package.json
````json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.3.1",
    "react-dom": "^19.3.1",
    "react-router-dom": "^7.18.4"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/node": "^24.19.2",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.2",
    "autoprefixer": "^10.6.1",
    "eslint": "^10.13.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.7",
    "globals": "^17.13.0",
    "postcss": "^8.5.31",
    "tailwindcss": "^3.4.19",
    "typescript": "~6.0.3",
    "typescript-eslint": "^8.71.2",
    "vite": "^8.3.4"
  }
}
````

## File: postcss.config.js
````javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
````

## File: README.md
````markdown
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
````

## File: tailwind.config.js
````javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#E11D48',
          600: '#C80D2E',
          700: '#B80D1D',
          800: '#8B0000',
        },
        olive: {
          800: '#1A261C',
          900: '#121B13',
          950: '#0B110C',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F4EFEA',
          200: '#E9DEC3',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(18, 27, 19, 0.07), 0 0 15px 0 rgba(184, 13, 29, 0.03)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'red-glow': '0 8px 25px -5px rgba(184, 13, 29, 0.35)',
      },
    },
  },
  plugins: [],
}
````

## File: tsconfig.app.json
````json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/*"]
    },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
````

## File: tsconfig.json
````json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "module": "nodenext",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
````

## File: vite.config.ts
````typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
````
