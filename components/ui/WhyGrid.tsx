export interface WhyItem { n: string; title: React.ReactNode; body: string }

interface WhyGridProps {
  id?: string
  eyebrow: string
  heading: React.ReactNode
  description: string
  items: WhyItem[]
  /** Tailwind bg for section — defaults to bone-paper */
  bg?: string
}

export default function WhyGrid({ id, eyebrow, heading, description, items, bg = 'bg-bone-paper' }: WhyGridProps) {
  return (
    <section
      id={id}
      className={bg}
      style={{
        padding: '120px 0',
        borderTop: '1px solid rgba(31,29,24,0.14)',
        borderBottom: '1px solid rgba(31,29,24,0.14)',
      }}
    >
      <div className="container-site">
        <div className="section-hd">
          <div>
            <div className="eyebrow mb-4">
              <span className="dot" />
              {eyebrow}
            </div>
            <h2
              className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
              style={{ fontSize: 'clamp(40px, 5.4vw, 76px)' }}
            >
              {heading}
            </h2>
          </div>
          <p className="text-[15px] leading-[1.65] text-bone-muted" style={{ maxWidth: '56ch' }}>
            {description}
          </p>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(31,29,24,0.14)]"
          style={{ border: '1px solid rgba(31,29,24,0.14)' }}
        >
          {items.map((w) => (
            <div
              key={w.n}
              className="bg-bone-bg flex flex-col gap-4"
              style={{ padding: '36px 32px' }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-clay">{w.n}</div>
              <h4
                className="font-serif font-medium leading-[1.05] text-bone-ink"
                style={{ fontSize: '26px' }}
              >
                {w.title}
              </h4>
              <p className="text-[14px] leading-[1.6] text-bone-muted">{w.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
