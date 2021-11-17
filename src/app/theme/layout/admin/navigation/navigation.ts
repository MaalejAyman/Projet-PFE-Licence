import {Injectable} from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'Menu',
    title: 'Menu',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'Home',
        title: 'Home',
        type: 'item',
        url: '/Dashboard/default',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'Passwords',
        title: 'Passwords',
        type: 'item',
        url: '/Dashboard/Passwords',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  }
];
const AdminNavigationItems = [
  {
    id: 'Menu',
    title: 'Menu',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'Home',
        title: 'Home',
        type: 'item',
        url: '/Dashboard/default',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'Passwords',
        title: 'Passwords',
        type: 'item',
        url: '/Dashboard/Passwords',
        classes: 'nav-item',
        icon: 'feather icon-server'
      },
      {
        id: 'Groupes',
        title: 'Groupes',
        type: 'item',
        url: '/Dashboard/Groupes',
        classes: 'nav-item',
        icon: 'feather icon-server'
      },
      {
        id: 'Websites',
        title: 'Websites',
        type: 'item',
        url: '/Dashboard/Websites',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  }
];

@Injectable()
export class NavigationItem {
  get() {
    if (localStorage.getItem('IsAdmin') === '1') {
      return AdminNavigationItems;
    }
    return NavigationItems;
  }
}
