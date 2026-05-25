import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Skeleton } from 'primereact/skeleton'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import type { ColumnProps } from 'primereact/column'

type DataTableComponentProps = {
	value: any[]
	loading?: boolean
	columns: (ColumnProps & { field: string })[]
	paginator?: boolean
	rows?: number
	rowsPerPageOptions?: number[]
	stripedRows?: boolean
	filters?: any
	onFilter?: (e: any) => void
	globalFilterFields?: string[]
	emptyMessage?: string
	className?: string
	lazy?: boolean
	totalRecords?: number
	first?: number
	onPage?: (e: any) => void
	onRowDelete?: (idAlquilerEquipo: number) => void
	scrollHeight?: string
	recordsReportLabel?: string
}

const baseHeaderClasses =
	'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 whitespace-nowrap'

const baseCellClasses =
	'px-4 py-4 text-sm text-slate-700 whitespace-nowrap'

export default function DataTableProp({
	value,
	loading = false,
	columns,
	paginator = true,
	rows = 10,
	rowsPerPageOptions = [5, 10, 20, 50],
	stripedRows = true,
	filters,
	onFilter,
	globalFilterFields = [],
	className = '',
	lazy = false,
	totalRecords = 0,
	first = 0,
	onPage,
	onRowDelete,
	scrollHeight = '70vh',
	recordsReportLabel,
}: DataTableComponentProps) {
	const [pageLinkSize, setPageLinkSize] = useState(5)

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 640px)')
		const handleChange = () => {
			setPageLinkSize(mediaQuery.matches ? 2 : 5)
		}

		handleChange()
		mediaQuery.addEventListener('change', handleChange)

		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [])

	const skeletonItems = Array.from({ length: rows }, (_, i) => ({ id: i }))

	const hasRecords = totalRecords > 0
	const startIndex = hasRecords ? first + 1 : 0
	const endIndex = hasRecords ? Math.min(first + rows, totalRecords) : 0

	const recordsReport = recordsReportLabel
		? `Mostrando ${startIndex}-${endIndex} de ${totalRecords} ${recordsReportLabel}`
		: ''

	const emptyMessageTemplate = () => (
		<div className="flex flex-col items-center justify-center gap-4 py-16">
			<div className="rounded-full bg-slate-100 p-4">
				<HiMagnifyingGlass className="h-8 w-8 text-slate-400" />
			</div>
			<div className="flex flex-col gap-1 text-center">
				<p className="text-base font-semibold text-slate-700">No se encontraron registros</p>
				<p className="text-sm text-slate-500">Intenta ajustar tus criterios de búsqueda</p>
			</div>
		</div>
	)

	return (
		<div className={`flex w-full flex-col gap-4 ${className}`}>
			<div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
				<DataTable
					value={loading ? skeletonItems : value}
					paginator={paginator}
					rows={rows}
					rowsPerPageOptions={rowsPerPageOptions}
					stripedRows={stripedRows}
					pageLinkSize={pageLinkSize}
					filters={filters}
					onFilter={onFilter}
					globalFilterFields={globalFilterFields}
					emptyMessage={emptyMessageTemplate()}
					paginatorTemplate="PrevPageLink PageLinks NextPageLink"
					paginatorLeft={
						recordsReportLabel ? (
							<span className="mr-3 text-[13px] font-medium text-slate-600">
								{recordsReport}
							</span>
						) : undefined
					}
					lazy={lazy}
					totalRecords={totalRecords}
					first={first}
					onPage={onPage}
					scrollable
					scrollHeight={scrollHeight}
					unstyled
					pt={{
						wrapper: {
							className:
								'w-full overflow-x-auto overflow-y-hidden scroll-smooth [-webkit-overflow-scrolling:touch]',
						},
						table: {
							className:
								'w-max min-w-full border-collapse text-sm table-auto',
						},
						thead: {
							className: 'bg-slate-50',
						},
						tbody: {
							className: 'divide-y divide-slate-100',
						},
						bodyRow: {
							className:
								'transition duration-200 hover:bg-slate-50',
						},
						paginator: {
							root: {
								className:
									'flex h-13 items-center justify-center gap-2 border-t border-slate-200 bg-[#f8f9fa] px-6 py-5',
							},
							pages: {
								className: 'flex items-center gap-2',
							},
							pageButton: ({ context }: any) => ({
								className: `
      flex h-8 w-8 items-center justify-center
      rounded-xl
      text-base font-medium
      transition-all duration-200
      ${context.active
										? 'bg-sky-900 text-white shadow-md'
										: 'text-slate-700 hover:bg-slate-200'
									}
    `,
							}),
							prevPageButton: {
								className:
									'ml-auto flex h-12 w-12 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-200',
							},
							nextPageButton: {
								className:
									'flex h-12 w-12 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-200',
							},
						},
					}}
				>
					{loading
						? columns.map((col) => (
							<Column
								key={col.field}
								field={col.field}
								header={col.header}
								body={<Skeleton />}
								style={col.style}
								className={col.className}
								headerClassName={`${baseHeaderClasses} ${col.headerClassName ?? ''}`}
								bodyClassName={`${baseCellClasses} ${col.bodyClassName ?? ''}`}
							/>
						))
						: columns.map((col) => {
							if (
								col.field === 'acciones' &&
								typeof col.body === 'function' &&
								onRowDelete
							) {
								return (
									<Column
										key={col.field}
										{...col}
										sortable={false}
										body={(row: any, options: any) =>
											typeof col.body === 'function'
												? col.body({ ...row, onRowDelete }, options)
												: null
										}
										headerClassName={`${baseHeaderClasses} ${col.headerClassName ?? ''}`}
										bodyClassName={`${baseCellClasses} ${col.bodyClassName ?? ''}`}
									/>
								)
							}

							return (
								<Column
									key={col.field}
									{...col}
									sortable={false}
									headerClassName={`${baseHeaderClasses} ${col.headerClassName ?? ''}`}
									bodyClassName={`${baseCellClasses} ${col.bodyClassName ?? ''}`}
								/>
							)
						})}
				</DataTable>
			</div>
		</div>
	)
}
