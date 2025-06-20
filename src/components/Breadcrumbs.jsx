import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ customLabels = {} }) => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const label = customLabels[path] || segment.charAt(0).toUpperCase() + segment.slice(1);

    return {
      label,
      path,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <nav className="text-sm text-gray-600 mb-4 flex items-center flex-wrap">
      <Link to="/" className="hover:underline text-blue-600 font-medium">Home</Link>
      {crumbs.map(({ label, path, isLast }, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <ChevronRight size={16} className="mx-1" />
          {isLast ? (
            <span className="text-gray-800 font-semibold">{label}</span>
          ) : (
            <Link to={path} className="hover:underline text-blue-600">{label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
