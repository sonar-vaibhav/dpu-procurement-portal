# 🧾 DPU Procurement System – Internal Automation Portal

[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Backend](https://img.shields.io/badge/Backend-.NET-blueviolet?logo=dotnet)]
[![Status](https://img.shields.io/badge/Status-Under%20Development-yellow)]()

---

## 📌 About the Project

DPU Procurement System is a centralized web-based portal designed to streamline the inventory procurement process across various colleges under Dr. D. Y. Patil Dnyan Pratishthan University, Pimpri. The system enables faculty and administrators to request items, process multi-step approvals, and generate purchase orders efficiently.

---

## ✨ Features

- 🔐 Role-based workflows for requesters, verifiers, and approvers
- 📥 Dynamic indent form with support for multiple items per request
- 🧾 Auto-generated Purchase Order PDFs with DPU branding using `jsPDF`
- 📄 Organized item specifications: quantity, expected price, etc.
- 📱 Fully responsive and intuitive frontend UI
- 📊 Planned: Admin dashboard with analytics and tracking

---

## 🧑‍💻 Tech Stack

| Layer     | Technology        |
|-----------|-------------------|
| Frontend  | React.js, Tailwind CSS, Shadcn |
| Backend   | .NET Core (API) |

---

## Font Implementation

This project uses **Metropolis** font throughout the entire system. The font is implemented using local OTF files for better performance and consistency.

### Current Font Setup

- **Font Family**: Metropolis
- **Source**: Local OTF files in `/public/` directory
- **Current Weight**: Thin (300) - used for all weights
- **Fallback**: Helvetica (for PDF generation)

### Adding More Font Weights

To add more Metropolis font weights:

1. **Place font files** in the `/public/` directory:
   - `metropolis.regular.otf` (weight 400)
   - `metropolis.medium.otf` (weight 500)
   - `metropolis.bold.otf` (weight 700)
   - etc.

2. **Update CSS** in `src/index.css`:
   ```css
   @font-face {
     font-family: 'Metropolis';
     src: url('/metropolis.regular.otf') format('opentype');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   ```

3. **Update PDF component** in `src/components/PurchaseOrderPDF.tsx`:
   ```javascript
   Font.register({
     family: 'Metropolis',
     fonts: [
       { src: '/metropolis.regular.otf', fontWeight: 'normal' },
       { src: '/metropolis.regular.otf', fontWeight: '400' },
       { src: '/metropolis.bold.otf', fontWeight: 'bold' },
     ],
   });
   ```

### Font Usage

- **Web Pages**: Automatically applied via Tailwind CSS classes
- **PDF Documents**: Applied via React-PDF font registration
- **Consistent Typography**: Same font family across all components
