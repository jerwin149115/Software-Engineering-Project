import '../Footer/Footer.css';
import { FooterBarBata } from './FooterBarData';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <ul>
                {FooterBarBata.map((item, index) => {
                    return (
                        <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </footer>
    );
}

export default Footer;
