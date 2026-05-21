import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
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
import { ALL_CATEGORIES, pathologyParameters, TREND_DATES } from '../features/trends/data';
import type { TrendParameter } from '../features/trends/types';

const INITIAL_VISIBLE_COUNT = 3;
const TABLE_VIEW_DATES = [...TREND_DATES].reverse();

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

function formatResultMonth(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function formatTableDate(iso: string) {
  const date = new Date(iso);
  return {
    day: date.toLocaleString('en-US', { day: '2-digit' }),
    month: date.toLocaleString('en-US', { month: 'short' }),
  };
}

function getPointForDate(param: TrendParameter, iso: string) {
  return param.dataPoints.find((point) => point.date === iso);
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

function ParameterRow({ param }: { param: TrendParameter }) {
  const latestPoint = getLatestPoint(param);
  const previousPoint = getPreviousPoint(param);
  const latest = latestPoint.value;
  const previous = previousPoint?.value;
  const status = getStatusLabel(param);
  const outOfRange = isOutOfRange(param);
  const direction = getDirection(param);
  const delta = previous === undefined ? null : latest - previous;
  const deltaLabel =
    delta === null
      ? 'Single reading'
      : `${delta > 0 ? '+' : delta < 0 ? '-' : ''}${fmtValue(Math.abs(delta))}`;
  const movementLabel =
    delta === null
      ? ''
      : direction === 'up'
        ? 'increased'
        : direction === 'down'
          ? 'decreased'
          : 'no change';

  return (
    <article
      className={clsx(
        'trends-parameter-card',
        outOfRange ? 'trends-parameter-card--danger' : 'trends-parameter-card--ok'
      )}
    >
      <div className="trends-parameter-card__header">
        <div className="trends-parameter-card__identity">
          <p className="trends-parameter-card__name">
            {param.name} <span>({param.unit})</span>
          </p>
        </div>
        <div className="trends-parameter-card__header-meta">
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
          <span className="trends-parameter-card__range">
            Range {param.referenceRange.label} {param.unit}
          </span>
        </div>
      </div>

      <div className="trends-parameter-card__result-grid">
        <div className="trends-parameter-card__result trends-parameter-card__result--latest">
          <p>{fmtValue(latest)}</p>
          <span>{formatResultMonth(latestPoint.date)}</span>
        </div>
        {previousPoint ? (
          <div className="trends-parameter-card__result trends-parameter-card__result--previous">
            <p>{fmtValue(previousPoint.value)}</p>
            <span>{formatResultMonth(previousPoint.date)}</span>
          </div>
        ) : (
          <div className="trends-parameter-card__result trends-parameter-card__result--previous">
            <p>--</p>
            <span>No previous result</span>
          </div>
        )}
      </div>

      <div className="trends-parameter-card__insight-row">
        <span
          className={clsx(
            'trends-parameter-card__delta',
            outOfRange && 'trends-parameter-card__delta--danger',
            !outOfRange && 'trends-parameter-card__delta--ok'
          )}
        >
          {deltaLabel}
        </span>
        {movementLabel ? <span>{movementLabel}</span> : null}
        <span className="trends-parameter-card__clinical-label">{param.clinicalLabel}</span>
      </div>

      <div className="trends-parameter-card__detail">
        <div className="param-chart-plot-shell">
          <MiniLineChart
            dataPoints={param.dataPoints}
            referenceRange={param.referenceRange}
          />
        </div>
      </div>
    </article>
  );
}

function ParameterSection({
  title,
  tone,
  params,
  visibleCount,
  onShowMore,
}: {
  title: string;
  tone: 'danger' | 'ok';
  params: TrendParameter[];
  visibleCount: number;
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

function TrendsTable({ params }: { params: TrendParameter[] }) {
  if (params.length === 0) {
    return <p className="trends-empty">No parameters match your current filters.</p>;
  }

  return (
    <div className="trends-table-wrapper">
      <table className="trends-table">
        <thead>
          <tr>
            <th className="trends-table__col-param">Parameter</th>
            {TABLE_VIEW_DATES.map((iso) => {
              const label = formatTableDate(iso);
              return (
                <th key={iso} className="trends-table__col-date">
                  <span className="trends-table__date-day">{label.day}</span>
                  <span className="trends-table__date-month">{label.month}</span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {params.map((param) => (
            <tr key={param.id}>
              <td>
                <span className="trends-table__name">{param.name}</span>
                <span className="trends-table__unit">{param.unit}</span>
              </td>
              {TABLE_VIEW_DATES.map((iso) => {
                const point = getPointForDate(param, iso);
                const isDanger =
                  point !== undefined &&
                  (point.value < param.referenceRange.low || point.value > param.referenceRange.high);

                return (
                  <td key={iso}>
                    <span
                      className={clsx(
                        'trends-table__value',
                        isDanger && 'trends-table__value--danger'
                      )}
                    >
                      {point ? fmtValue(point.value) : '--'}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TrendsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('chart');
  const [summaryFilter, setSummaryFilter] = useState<'out' | 'in' | null>(null);
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
      return catMatch && searchMatch;
    });

    return [...base].sort(rankParameters);
  }, [activeCategory, search]);

  const outOfRangeParams = filtered.filter(isOutOfRange);
  const withinRangeParams = filtered.filter((param) => !isOutOfRange(param));
  const visibleOutOfRangeParams =
    summaryFilter === 'in' ? [] : outOfRangeParams;
  const visibleWithinRangeParams =
    summaryFilter === 'out' ? [] : withinRangeParams;

  const resetDetailState = () => {
    setVisibleCounts({ out: INITIAL_VISIBLE_COUNT, in: INITIAL_VISIBLE_COUNT });
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

  const handleSummaryFilterToggle = (next: 'out' | 'in') => {
    resetDetailState();
    setSummaryFilter((current) => (current === next ? null : next));
  };

  const visibleTableParams =
    summaryFilter === 'out'
      ? outOfRangeParams
      : summaryFilter === 'in'
        ? withinRangeParams
        : filtered;

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
          <span className="trends-toggle__label">Table view</span>
          <button
            type="button"
            className={clsx(
              'trends-toggle__switch',
              viewMode === 'table' && 'trends-toggle__switch--active'
            )}
            onClick={() => setViewMode((current) => (current === 'chart' ? 'table' : 'chart'))}
            aria-pressed={viewMode === 'table'}
          >
            <span className="trends-toggle__thumb" />
          </button>
        </label>

        <div className="trends-section-header">
          <span className="trends-section-label">Pathology</span>
        </div>

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

        {viewMode === 'table' ? (
          <TrendsTable params={visibleTableParams} />
        ) : (
          <div className="stack">
            {summaryFilter !== 'in' && (
              <ParameterSection
                title="Out of range"
                tone="danger"
                params={visibleOutOfRangeParams}
                visibleCount={visibleCounts.out}
                onShowMore={() => handleShowMore('out')}
              />
            )}
            {summaryFilter !== 'out' && (
              <ParameterSection
                title="Within range"
                tone="ok"
                params={visibleWithinRangeParams}
                visibleCount={visibleCounts.in}
                onShowMore={() => handleShowMore('in')}
              />
            )}
          </div>
        )}
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
