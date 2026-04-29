import { PRESENTATION } from '../../config/presentation';

export default function Footer() {
  return (
    <footer className="glass mx-4 mt-2 mb-4 px-6 py-4 text-center text-xs text-gray-500">
      <div className="space-y-1">
        <div className="font-semibold text-gray-400">{PRESENTATION.title}</div>
        {PRESENTATION.course && <div>{PRESENTATION.course}</div>}
        {PRESENTATION.professor && <div>Prof. {PRESENTATION.professor}</div>}
        {PRESENTATION.members.length > 0 && (
          <div>Team: {PRESENTATION.members.join(', ')}</div>
        )}
        {PRESENTATION.date && <div>{PRESENTATION.date}</div>}
      </div>
    </footer>
  );
}
