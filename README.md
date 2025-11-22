# HelixMaster 97

A modern, web-based engineering tool for the parametric design of two-stage helical gearboxes. This project is a modernization of the "Parametric Design of Two-Stage Helical Gear Boxes" thesis (1997), bringing complex mechanical engineering calculations to the browser with a responsive UI and instant feedback.

![HelixMaster 97 Screenshot](https://placehold.co/1200x600/1e293b/ffffff?text=HelixMaster+97+Interface)

## Features

*   **Two-Stage Reducer Design:** Complete calculation of gear geometry, forces, and safety factors for 2-stage helical systems.
*   **Shaft Analysis:** Calculation of shaft diameters, reaction forces, bending/torsional moments, and stress checks based on gear loads.
*   **Bearing Selection:** Integrated SKF catalog for selecting bearings and calculating L10h fatigue life.
*   **Interactive Visualizations:**
    *   Gear geometry schematics.
    *   Shaft load diagrams (Free Body Diagrams).
    *   Ratio distribution analysis.
*   **Reporting & Export:**
    *   Generate comprehensive PDF design reports.
    *   Export `.DAT` files compatible with AutoCAD AutoLISP scripts for automated 3D modeling.
*   **Modern UI:** Built with React & Tailwind CSS, featuring Dark Mode support and mobile responsiveness.

## Tech Stack

*   **Framework:** [React](https://react.dev/) (v19)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Utilities:**
    *   `recharts`: For data visualization.
    *   `jspdf` & `html2canvas`: For PDF report generation.
    *   `jszip` & `file-saver`: For exporting CAD data.

## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/helixmaster-97.git
    cd helixmaster-97
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open your browser at `http://localhost:3000` (or the port shown in your terminal).

## Usage Workflow

1.  **Reducer Tab:** Input your motor power, input/output speeds, and material preferences. The system automatically calculates tooth counts, modules, and safety factors.
2.  **Shaft Tab:** Use the "Mil Hesabına Gönder" buttons in the Reducer tab or manually input forces. Adjust bearing distances (L1, L2) and material to check shaft strength.
3.  **Bearing Tab:** Select bearings from the catalog to verify if they meet the required operating life hours under the calculated loads.
4.  **Report Tab:** View a summary of the entire design.
    *   **PDF İndir:** Download a professional project report.
    *   **AutoCAD (.DAT) İndir:** Download data files to drive AutoCAD scripts.

## License

This project is open source and available under the [MIT License](LICENSE).

---
*Developed with modern web technologies to preserve and enhance classic engineering tools.*