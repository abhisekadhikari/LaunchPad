import "./globals.css"

export const metadata = {
    title: "LaunchPad - Automated Front-End Deployment Platform | Effortless Serverless Deployments",
    description:
        "LaunchPad is an automated front-end deployment platform that streamlines the deployment process for web developers. Focus on coding while we handle seamless, serverless deployments. Fast, efficient, and hassle-free.",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
