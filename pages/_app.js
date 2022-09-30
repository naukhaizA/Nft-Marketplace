import '../styles/globals.css'
import Link from 'next/link'



function MyApp({ Component, pageProps }) {
  // header('Access-Control-Allow-Origin: *');
  // header('Access-Control-Allow-Methods: GET, POST'); 
  // header("Access-Control-Allow-Headers: X-Requested-With");
  
  
  return (
    
    <div>
      
    
    <nav className='p-4 bg-black backdrop-filter backdrop-blur-lg bg-opacity-90 '>
      
        <div className="flex">
          
          <Link href="/">
            <button className='text-white transition ease-in-out delay-150 duration-200 hover:scale-110 text-3xl  pr-2 pl-10 font-semibold mr-5 '>
              <span className='hover:text-transparent bg-clip-text transition-all duration-500 bg-gradient-to-t to-white via-gray-700 from-red-500 bg-size-200 bg-pos-0 hover:bg-pos-100 '>
              NFT Marketplace

              </span>
              </button> 
          </Link>
          <p className='pl-80'></p>
          <Link href="/homepage" > 
            <a className="transition ease-in-out delay-150 duration-200 mr-2 rounded-full px-7 py-2 font-bold text-white active:text-red-500  focus:text-red-600 focus:underline hover:text-red-600 hover:underline hover:scale-110">
              Home
            </a>
          </Link>

          <Link href="/create-item" > 
            <a className="transition ease-in-out delay-150 duration-200 mr-2 px-7 rounded-full py-2 focus:text-red-600 focus:underline hover:text-red-600 hover:underline hover:scale-110 text-white font-bold">
              List to Market
            </a>
          </Link>

          
          <Link href="/my-assets" > 
            <a className="transition ease-in-out delay-150 duration-200 mr-2 px-7 py-2 rounded-full focus:text-red-600 focus:underline hover:text-red-600 hover:underline hover:scale-110 text-white font-bold ">
              My Digital Assets
            </a>
          </Link>

          <Link href="/creater-dashboard" > 
            <a className="transition ease-in-out delay-150 duration-200 mr-2 px-7 py-2 rounded-full focus:text-red-600 focus:underline hover:text-red-600 hover:underline hover:scale-110 text-white font-bold">
              My Dashboard
            </a>
          </Link>
          

        </div>

      
    </nav>
    
    <Component {...pageProps} />
    </div>
  ) 


}

export default MyApp
