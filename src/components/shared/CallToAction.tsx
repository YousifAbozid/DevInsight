import { Link } from 'react-router-dom';

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export function CallToAction({
  title,
  description,
  buttonText,
  buttonLink,
}: CallToActionProps) {
  return (
    <div className="mt-8 p-6 bg-l-bg-2 dark:bg-d-bg-2 rounded-lg border border-dashed border-border-l dark:border-border-d text-center">
      <h3 className="text-xl font-semibold text-l-text-1 dark:text-d-text-1 mb-2">
        {title}
      </h3>
      <p className="text-l-text-2 dark:text-d-text-2 mb-4">{description}</p>
      <Link
        to={buttonLink}
        className="inline-block px-6 py-3 bg-accent-1 text-white rounded-lg hover:bg-accent-1/90 transition-colors"
      >
        {buttonText}
      </Link>
    </div>
  );
}
