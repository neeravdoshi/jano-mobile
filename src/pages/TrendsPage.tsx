import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Search,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';

import { patients } from '../fixtures/patients';
import { motionTokens } from '../design-system/motion';
import { MiniLineChart } from '../features/trends/components/MiniLineChart';
import { ALL_CATEGORIES, pathologyParameters } from '../features/trends/data';
import type { TrendParameter } from '../features/trends/types';

const INITIAL_VISIBLE_COUNT = 3;

function fmtValue(v: number): string {
  if (Math.abs(v) >= 100) return Math.round(v).toString();
  if (Math.abs(v) >= 10) return v.toFixed(1);
  return v.toFixed(1);
}

function getLatestPoint(param: TrendParameter) {
  return param.dataPoints[param.dataPoints.length - 1];
}

function getPreviousPoint(param: TrendParameter) {
  return param.dataPoints[param.dataPoints.length - 2];
}

function isOutOfRange(param: TrendParameter): boolean {
  const latest = getLatestPoint(param).value;
  return latest < param.referenceRange.low || latest > param.referenceRange.high;
}

function getDirection(param: TrendParameter): 'up' | 'down' | 'flat' {
  const latest = getLatestPoint(param).value;
  const previous = getPreviousPoint(param)?.value;

  if (previous === undefined || latest === previous) return 'flat';
  return latest > previous ? 'up' : 'down';
}

function getChangeMagnitude(param: TrendParameter): number {
  const latest = getLatestPoint(param).value;
  const previous = getPreviousPoint(param)?.value;
  return previous === undefined ? 0 : Math.abs(latest - previous);
}

function getStatusLabel(param: TrendParameter): string {
  const latest = getLatestPoint(param).value;
  if (latest > param.referenceRange.high) return 'High';
  if (latest < param.referenceRange.low) return 'Low';
  return 'Within range';
}

function rankParameters(a: TrendParameter, b: TrendParameter): number {
  if (b.severityScore !== a.severityScore) return b.severityScore - a.severityScore;
  return getChangeMagnitude(b) - getChangeMagnitude(a);
}

function SummaryCard({
  count,
  label,
  tone,
  selected,
  onClick,
}: {
  count: number;
  label: string;
  tone: 'danger' | 'ok';
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'trends-summary-card',
        tone === 'danger' ? 'trends-summary-card--danger' : 'trends-summary-card--ok',
        selected && 'trends-summary-card--selected'
      )}
    >
      <p className="trends-summary-card__label">{label}</p>
      <p className="trends-summary-card__count">
        {count}
        <span> Parameters</span>
      </p>
    </button>
  );
}

function ParameterRow({
  param,
  expanded,
  onToggle,
}: {
  param: TrendParameter;
  expanded: boolean;
  onToggle: () => void;
}) {
  const latest = getLatestPoint(param).value;
  const previous = getPreviousPoint(param)?.value;
  const status = getStatusLabel(param);
  const outOfRange = isOutOfRange(param);
  const direction = getDirection(param);
  const delta = previous === undefined ? null : latest - previous;

  return (
    <article
      className={clsx(
        'trends-parameter-card',
        outOfRange ? 'trends-parameter-card--danger' : 'trends-parameter-card--ok',
        expanded && 'trends-parameter-card--expanded'
      )}
    >
      <button
        type="button"
        className="trends-parameter-card__toggle"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className="trends-parameter-card__main">
          <div className="trends-parameter-card__identity">
            <p className="trends-parameter-card__name">{param.name}</p>
            <p className="trends-parameter-card__range">
              Range {param.referenceRange.label} · {param.clinicalLabel}
            </p>
          </div>
          <div className="trends-parameter-card__values">
            {previous !== undefined && (
              <>
                <span className="trends-parameter-card__value-chip trends-parameter-card__value-chip--previous">
                  {fmtValue(previous)}
                </span>
                <ChevronRight size={16} className="trends-parameter-card__arrow" />
              </>
            )}
            <span
              className={clsx(
                'trends-parameter-card__value-chip',
                outOfRange
                  ? 'trends-parameter-card__value-chip--danger'
                  : 'trends-parameter-card__value-chip--ok'
              )}
            >
              {fmtValue(latest)}
            </span>
          </div>
        </div>
        <div className="trends-parameter-card__meta-row">
          <span
            className={clsx(
              'trends-parameter-card__status',
              outOfRange
                ? 'trends-parameter-card__status--danger'
                : 'trends-parameter-card__status--ok'
            )}
          >
            {status}
          </span>
          <span className="trends-parameter-card__delta">
            {delta === null
              ? 'Single reading'
              : `${direction === 'up' ? 'Up' : direction === 'down' ? 'Down' : 'No change'} ${fmtValue(Math.abs(delta))} ${param.unit}`}
          </span>
          <ChevronDown
            size={18}
            className={clsx(
              'trends-parameter-card__expand-icon',
              expanded && 'trends-parameter-card__expand-icon--expanded'
            )}
          />
        </div>
      </button>

      {expanded && (
        <div className="trends-parameter-card__detail">
          <div className="param-chart-summary">
            <div>
              <p className="param-chart-value">
                {fmtValue(latest)}
                <span className="param-chart-value-unit"> {param.unit}</span>
              </p>
              <p className="param-chart-caption">Latest result</p>
            </div>
            <div className="param-chart-delta-block">
              <p
                className={clsx(
                  'param-chart-delta',
                  direction === 'up' && 'param-chart-delta--up',
                  direction === 'down' && 'param-chart-delta--down'
                )}
              >
                {delta === null
                  ? '—'
                  : `${direction === 'up' ? '+' : direction === 'down' ? '−' : ''}${fmtValue(Math.abs(delta))}`}
              </p>
              <p className="param-chart-caption">
                {previous !== undefined ? 'vs previous' : 'Single reading'}
              </p>
            </div>
          </div>
          <div className="param-chart-plot-shell">
            <MiniLineChart
              dataPoints={param.dataPoints}
              referenceRange={param.referenceRange}
            />
          </div>
        </div>
      )}
    </article>
  );
}

function ParameterSection({
  title,
  tone,
  params,
  visibleCount,
  expandedId,
  onToggleExpanded,
  onShowMore,
}: {
  title: string;
  tone: 'danger' | 'ok';
  params: TrendParameter[];
  visibleCount: number;
  expandedId: string | null;
  onToggleExpanded: (id: string) => void;
  onShowMore: () => void;
}) {
  const visibleParams = params.slice(0, visibleCount);
  const remainingCount = Math.max(params.length - visibleParams.length, 0);

  return (
    <section
      className={clsx(
        'trends-group-card',
        tone === 'danger' ? 'trends-group-card--danger' : 'trends-group-card--ok'
      )}
    >
      <div className="trends-group-card__header">
        <div className={clsx('trends-group-card__accent', `trends-group-card__accent--${tone}`)} />
        <div>
          <h2 className="trends-group-card__title">
            {params.length} {title} parameters
          </h2>
          <p className="trends-group-card__subtitle">
            Ranked by clinical priority and recent movement
          </p>
        </div>
      </div>

      <div className="trends-group-card__list">
        {visibleParams.length === 0 ? (
          <p className="trends-group-card__empty">No parameters match your current filters.</p>
        ) : (
          visibleParams.map((param) => (
            <ParameterRow
              key={param.id}
              param={param}
              expanded={expandedId === param.id}
              onToggle={() => onToggleExpanded(param.id)}
            />
          ))
        )}
      </div>

      {remainingCount > 0 && (
        <button type="button" className="trends-show-more" onClick={onShowMore}>
          Show {remainingCount} more parameters
          <ChevronDown size={16} />
        </button>
      )}
    </section>
  );
}

export function TrendsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [keyOnly, setKeyOnly] = useState(false);
  const [summaryFilter, setSummaryFilter] = useState<'out' | 'in' | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleCounts, setVisibleCounts] = useState({ out: INITIAL_VISIBLE_COUNT, in: INITIAL_VISIBLE_COUNT });

  const patientId = (location.state as { patientId?: string } | null)?.patientId;
  const patient =
    patients.find((entry) => entry.id === patientId) ?? patients[0];

  const filtered = useMemo(() => {
    const base = pathologyParameters.filter((p) => {
      const catMatch = !activeCategory || p.category === activeCategory;
      const searchNeedle = search.toLowerCase();
      const searchMatch =
        !searchNeedle ||
        p.name.toLowerCase().includes(searchNeedle) ||
        p.clinicalLabel.toLowerCase().includes(searchNeedle);
      const keyMatch = !keyOnly || p.isKeyParameter;
      return catMatch && searchMatch && keyMatch;
    });

    return [...base].sort(rankParameters);
  }, [activeCategory, keyOnly, search]);

  const outOfRangeParams = filtered.filter(isOutOfRange);
  const withinRangeParams = filtered.filter((param) => !isOutOfRange(param));
  const visibleOutOfRangeParams =
    summaryFilter === 'in' ? [] : outOfRangeParams;
  const visibleWithinRangeParams =
    summaryFilter === 'out' ? [] : withinRangeParams;

  const resetDetailState = () => {
    setExpandedId(null);
    setVisibleCounts({ out: INITIAL_VISIBLE_COUNT, in: INITIAL_VISIBLE_COUNT });
  };

  const handleToggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleShowMore = (section: 'out' | 'in') => {
    setVisibleCounts((current) => ({
      ...current,
      [section]: current[section] + INITIAL_VISIBLE_COUNT,
    }));
  };

  const handleCategoryChange = (category: string | null) => {
    resetDetailState();
    setActiveCategory(category);
  };

  const handleSearchChange = (value: string) => {
    resetDetailState();
    setSearch(value);
  };

  const handleKeyOnlyToggle = () => {
    resetDetailState();
    setKeyOnly((current) => !current);
  };

  const handleSummaryFilterToggle = (next: 'out' | 'in') => {
    resetDetailState();
    setSummaryFilter((current) => (current === next ? null : next));
  };

  return (
    <motion.div
      className="trends-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTokens.spring.sheet}
    >
      <header className="subpage-header">
        <button
          className="subpage-header__back"
          type="button"
          aria-label="Back"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={22} />
        </button>
        <div className="subpage-header__title-group">
          <h1 className="subpage-header__title">Trends</h1>
          <p className="subpage-header__subtitle">
            {patient.name} · MRN {patient.id.toUpperCase()}
          </p>
        </div>
        <button className="trends-header-action" type="button" aria-label="Download PDF report">
          <Download size={16} />
          PDF
        </button>
      </header>

      <div className="trends-body">
        <div className="trends-summary-grid">
          <SummaryCard
            count={outOfRangeParams.length}
            label="Out of range"
            tone="danger"
            selected={summaryFilter === 'out'}
            onClick={() => handleSummaryFilterToggle('out')}
          />
          <SummaryCard
            count={withinRangeParams.length}
            label="Within range"
            tone="ok"
            selected={summaryFilter === 'in'}
            onClick={() => handleSummaryFilterToggle('in')}
          />
        </div>

        <label className="trends-toggle">
          <span className="trends-toggle__label">Key parameters only</span>
          <button
            type="button"
            className={clsx('trends-toggle__switch', keyOnly && 'trends-toggle__switch--active')}
            onClick={handleKeyOnlyToggle}
            aria-pressed={keyOnly}
          >
            <span className="trends-toggle__thumb" />
          </button>
        </label>

        <div className="trends-search">
          <label className="trends-search__field">
            <Search size={15} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search parameter or clinical area..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </label>
        </div>

        <div className="trends-section-header">
          <span className="trends-section-label">Pathology</span>
        </div>

        <div className="trends-filters">
          <button
            type="button"
            className={clsx('pill trends-filter-pill', !activeCategory && 'trends-filter-pill--active')}
            onClick={() => handleCategoryChange(null)}
          >
            All
            {!activeCategory && <X size={10} strokeWidth={2.5} />}
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={clsx(
                'pill trends-filter-pill',
                activeCategory === cat && 'trends-filter-pill--active'
              )}
              onClick={() =>
                handleCategoryChange(activeCategory === cat ? null : cat)
              }
            >
              {cat}
              {activeCategory === cat && <X size={10} strokeWidth={2.5} />}
            </button>
          ))}
        </div>

        <div className="stack">
          {summaryFilter !== 'in' && (
            <ParameterSection
              title="Out of range"
              tone="danger"
              params={visibleOutOfRangeParams}
              visibleCount={visibleCounts.out}
              expandedId={expandedId}
              onToggleExpanded={handleToggleExpanded}
              onShowMore={() => handleShowMore('out')}
            />
          )}
          {summaryFilter !== 'out' && (
            <ParameterSection
              title="Within range"
              tone="ok"
              params={visibleWithinRangeParams}
              visibleCount={visibleCounts.in}
              expandedId={expandedId}
              onToggleExpanded={handleToggleExpanded}
              onShowMore={() => handleShowMore('in')}
            />
          )}
        </div>
      </div>

      <div className="trends-create-bar">
        <button
          type="button"
          className="floating-create-button"
          onClick={() => navigate('/reports/new', { state: { patientId: patient.id } })}
        >
          <Plus size={16} />
          <span>New report</span>
        </button>
      </div>
    </motion.div>
  );
}
