import 'semantic-ui-css/semantic.min.css'
import { SessionProvider } from "next-auth/react"

export default function MyApp({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}