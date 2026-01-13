function Table({ columns, data, renderCell, actions, emptyText = 'Không có dữ liệu' }) {
  const colCount = columns.length + (actions ? 1 : 0);

  return (
    <div className="table-card-wrapper">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} style={column.width ? { width: column.width } : undefined}>
                  {column.title}
                </th>
              ))}
              {actions && <th>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={colCount}>{emptyText}</td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {renderCell ? renderCell(row, column.key) : row[column.key] ?? ''}
                    </td>
                  ))}
                  {actions && (
                    <td>
                      <div className="table-actions">{actions(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
