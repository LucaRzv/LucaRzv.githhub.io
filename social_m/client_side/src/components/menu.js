import React, { useState, useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/authentification'

export default function PageMenu () {
        // set active path with url
        const pathname = window.location.pathname;

        // start from the second letter because first is '/' which is home
        const path = pathname === '/'? 'home' : pathname.substr(1);

        const [activeItem, setItem] = useState(path);
        
        const handleItemClick = (event, { name }) => setItem( name );

        const context = useContext(AuthContext);

        return(
            context.user? (
            <div>
            <Menu pointing secondary size='huge'>
            <Menu.Item
                name={ context.user.username }
                
                // make it behave like a link
                as={ Link } 
                to='/home'
            />
            <Menu.Item
                name='messages'
                active={activeItem === 'messages'}
                onClick={handleItemClick}
                // nothing for now
            />
            <Menu.Item
                name='friends'
                active={activeItem === 'friends'}
                onClick={handleItemClick}
                // nothing for now
            />
            <Menu.Menu position='right'>
                <Menu.Item
                name='logout'
                active={activeItem === 'logout'}
                onClick={context.logout}
                />
            </Menu.Menu>
        </Menu>
        </div>
            ) : (
            // each menu item has a name and if the active property is true it means
            // we're active on the page and the tab link will be highlighted
            <div>
            <Menu pointing secondary size='huge'>
            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={handleItemClick}
                // make it behave like a link
                as={ Link } 
                to='/home'
            />
            <Menu.Item
                name='messages'
                active={activeItem === 'messages'}
                onClick={handleItemClick}
                // nothing for now
            />
            <Menu.Item
                name='friends'
                active={activeItem === 'friends'}
                onClick={handleItemClick}
                // nothing for now
            />
            <Menu.Menu position='right'>
                <Menu.Item
                name='register'
                active={activeItem === 'register'}
                onClick={handleItemClick}
                as={ Link } 
                to='/register'
                />
                <Menu.Item
                name='login'
                active={activeItem === 'login'}
                onClick={handleItemClick}
                as={ Link } 
                to='/login'
                />
            </Menu.Menu>
        </Menu>
        </div>
            )
        )
    }
