import React from 'react';

const SourceLink = ({ link, ...props }) => {
  /* eslint-disable jsx-a11y/anchor-has-content */
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" {...props} />
  );
};

export default SourceLink;
