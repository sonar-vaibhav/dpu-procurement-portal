// Metropolis Font Registration for React-PDF
import { Font } from '@react-pdf/renderer';

// For now, let's use Inter font which is very similar to Metropolis
// This is a professional, modern font that looks great in PDFs
export const registerMetropolisFont = () => {
  Font.register({
    family: 'Inter',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 'normal' },
      { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 'bold' },
    ],
  });
  console.log('✅ Inter font registered (similar to Metropolis)');
};

// Alternative: If you want to use Metropolis later, you can:
// 1. Convert your OTF file to base64 using an online tool
// 2. Replace the Inter font with the base64 Metropolis font
// 3. Uncomment the code below and replace with your base64 font

/*
export const registerMetropolisFont = () => {
  Font.register({
    family: 'Metropolis',
    fonts: [
      { 
        src: 'data:font/opentype;base64,YOUR_BASE64_FONT_HERE',
        fontWeight: 'normal' 
      },
      { 
        src: 'data:font/opentype;base64,YOUR_BASE64_FONT_HERE',
        fontWeight: 'bold' 
      },
    ],
  });
};
*/ 