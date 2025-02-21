import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Slide } from "react-toastify";
import { useRouter } from "next/router";
import { useEffect } from "react";
import 'nprogress/nprogress.css';    
import NProgress from 'nprogress';        
    


export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", () => NProgress.start());

    // Stop the progress bar when route change is complete or errors
    router.events.on("routeChangeComplete", () => NProgress.done());
    router.events.on("routeChangeError", () => NProgress.done());
  }, [router]);
  // Start the progress bar when route change starts

  return (
    <Provider store={store}>
      {getLayout(
        <>
          {/* {loading && <LoadingSpinner />} */}
          <Component {...pageProps} />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="dark"
            transition={Slide}
          />
        </>
      )}
    </Provider>
  );
}
