import { styled, Theme } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import clsx from 'clsx'
import * as React from 'react'
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
} from 'react-virtualized'

const classes = {
  flexContainer: 'ReactVirtualizedDemo-flexContainer',
  tableRow: 'ReactVirtualizedDemo-tableRow',
  tableRowHover: 'ReactVirtualizedDemo-tableRowHover',
  tableCell: 'ReactVirtualizedDemo-tableCell',
  noClick: 'ReactVirtualizedDemo-noClick',
}

const styles = ({ theme }: { theme: Theme }) =>
  ({
    [`& .${classes.flexContainer}`]: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    [`& .${classes.tableRow}`]: {
      cursor: 'pointer',
    },
    [`& .${classes.tableRowHover}`]: {
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
    [`& .${classes.tableCell}`]: {
      flex: 1,
    },
    [`& .${classes.noClick}`]: {
      cursor: 'initial',
    },
  } as const)

interface ColumnData {
  dataKey: string
  label: string
  width: number
}

interface Row {
  index: number
}

interface MuiVirtualizedTableProperties<T extends { index: number }> {
  columns: readonly ColumnData[]
  headerHeight?: number
  rowCount: number
  initialRowCount: number
  rowGetter: (row: Row) => T
  rowHeight?: number
  loadData: () => void
}

class MuiVirtualizedTable<
  T extends { index: number },
> extends React.PureComponent<MuiVirtualizedTableProperties<T>> {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  }

  tableRef: Table | null

  constructor(properties: MuiVirtualizedTableProperties<T>) {
    super(properties)

    // eslint-disable-next-line unicorn/no-null
    this.tableRef = null
  }

  componentDidUpdate() {
    if (this.props.rowCount === this.props.initialRowCount) {
      this.tableRef?.scrollToPosition(0)
    }
  }

  getRowClassName = () => {
    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: false,
    })
  }

  cellRenderer: TableCellRenderer = ({ cellData, rowIndex }) => {
    const { rowHeight, rowCount, loadData } = this.props

    if (rowCount === rowIndex + 1) {
      loadData()
    }

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: true,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align="right"
      >
        {cellData}
      </TableCell>
    )
  }

  headerRenderer = ({ label }: TableHeaderProps) => {
    const { headerHeight } = this.props

    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick,
        )}
        variant="head"
        style={{ height: headerHeight }}
        align="left"
      >
        {/* @ts-ignore */}
        <span>{label}</span>
      </TableCell>
    )
  }

  render() {
    const { columns, rowHeight, headerHeight, ...tableProperties } = this.props
    return (
      //@ts-ignore
      <AutoSizer>
        {({ height, width }) => (
          //@ts-ignore
          <Table
            ref={(element) => (this.tableRef = element)}
            height={height}
            width={width}
            rowHeight={rowHeight!}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight!}
            {...tableProperties}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }) => {
              return (
                //@ts-ignore
                <Column
                  key={dataKey}
                  headerRenderer={(headerProperties) =>
                    this.headerRenderer({
                      ...headerProperties,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              )
            })}
          </Table>
        )}
      </AutoSizer>
    )
  }
}

const VirtualizedTable = styled(MuiVirtualizedTable)(styles)

export default VirtualizedTable
