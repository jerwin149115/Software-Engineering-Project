import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Home',
    path: '/dashboard',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Reports',
    path: '/dashboard/reports/pages',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
  {
    title: 'Products',
    path: '/dashboard/product/pages',
    icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text'
  },
  {
    title: 'Quantity',
    path: '/dashboard/quantity/pages',
    icon: <IoIcons.IoIosPricetags />,
    cName: 'nav-text'
  },
  {
    title: 'Team',
    path: '/dashboard/team/pages',
    icon: <IoIcons.IoMdPeople />,
    cName: 'nav-text'
  },
  {
    title: 'Analytics',
    path: '/dashboard/analytics/pages',
    icon: <IoIcons.IoIosAnalytics />,
    cName: 'nav-text'
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <IoIcons.IoMdBackspace />,
    cName: 'nav-text'
  }
];