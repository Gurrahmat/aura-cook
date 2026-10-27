import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { drawerOpened, pageChanged } from '../store/uiSlice';
import { selectCurrentPage, selectTimerCount } from '../store/selectors';
import { Utensils, Home, BookOpen, Flame, Box, Timer } from 'lucide-react';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector(selectCurrentPage);
  const timerCount = useAppSelector(selectTimerCount);

  const links = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'recipes', label: 'Recipes', Icon: BookOpen },
    { id: 'cooking', label: 'Cooking Mode', Icon: Flame },
    { id: 'pantry', label: 'Pantry', Icon: Box }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-auracook">
      <div className="container-fluid">
        <a
          className="navbar-brand-auracook"
          href="#"
          onClick={(e) => { e.preventDefault(); dispatch(pageChanged('home')); }}
        >
          <Utensils className="me-2" /> AuraCook
        </a>

        <div className="collapse navbar-collapse show" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            {links.map(({ id, label, Icon }) => (
              <li className="nav-item" key={id}>
                <a
                  className={`nav-link-auracook ${currentPage === id ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => { e.preventDefault(); dispatch(pageChanged(id)); }}
                >
                  <Icon size={18} /> {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-auracook-secondary btn-toggle-timer position-relative"
              onClick={() => dispatch(drawerOpened())}
            >
              <Timer size={18} className="me-1" /> Timers
              <span className="badge-timer-count ms-2">{timerCount}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
