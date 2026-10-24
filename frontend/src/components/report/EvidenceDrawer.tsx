export function EvidenceDrawer({ source, _onClose }: any) { if (!source) return null; return <div className='p-2 border bg-white'>Evidence: {source.url}</div>; }
