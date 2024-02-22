import Link from 'next/link';
import DiscordIcon from 'src/icons/DiscordIcon';
import TwitterIcon from 'src/icons/TwitterIcon';

const Footer = () => {
  return (
    <footer className="flex flex-col text-center justify-center items-center p-2.5 text-xs text-white space-x-2">
      <div className='flex flex-row'>
        <Link href="https://twitter.com/RemyToken" target="_blank">
          <TwitterIcon />
        </Link>

        <Link href="" target="_blank">
          <DiscordIcon />
        </Link>
      </div>
      <div>
        <Link href="https://github.com/RemyToken/remyswap.github.io" target="_blank">
          <p className="text-blue">View source code</p>
        </Link>
      </div>
      
    </footer>
  );
};

export default Footer;
