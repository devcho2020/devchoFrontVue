/** @type {import('tailwindcss').Config} */
export default {
    // ⚠️ [필수] Tailwind가 스타일을 적용하고 감시할 파일 경로들을 명시합니다.
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}", // 👈 이게 있어야 하위 폴더 새 파일들도 영구적으로 안전합니다.
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}