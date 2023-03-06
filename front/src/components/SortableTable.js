import React, { useEffect, useState } from "react";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { Col, Row, Table } from "reactstrap";
import PropTypes from "../utils/propTypes";
import { TailSpin } from "react-loading-icons";

const SortableTable = ({ columns, values, isLoading, ...props }) => {
    const [sortColumn, setSortColumn] = useState(undefined);
    const [sortInverted, setSortInverted] = useState(false);
    const [sortedValues, setSortedValues] = useState([]);

    useEffect(() => {
        if (sortColumn === undefined) {
            let mainColumn = columns.filter((c) => c.isMain === true);
            if (mainColumn.length > 0) {
                setSortColumn(mainColumn[0]);
            } else if (columns.length > 0) {
                setSortColumn(columns[0]);
            }
            setSortedValues(values);
            return;
        }
        setSortedValues([
            ...values.sort((a, b) => {
                let aValue = a[sortColumn.key];
                let bValue = b[sortColumn.key];

                const inverted = sortInverted ? -1 : 1;
                if (aValue < bValue) return -1 * inverted;
                else if (aValue > bValue) return 1 * inverted;
                else return 0;
            }),
        ]);
    }, [values, columns, sortColumn, sortInverted]);

    const sortWithColumn = (col) => {
        if (sortColumn.key === col.key) {
            setSortInverted(!sortInverted);
        } else {
            setSortInverted(false);
            setSortColumn(col);
        }
    };

    return (
        <>
            <Table {...{ striped: true }}>
                <thead>
                    <tr>
                        {columns.map((column) => {
                            return (
                                <th
                                    scope="col"
                                    onClick={() => {
                                        if (column.sortable !== false) {
                                            sortWithColumn(column);
                                        }
                                    }}
                                >
                                    {column.value}
                                    {sortColumn?.key === column.key &&
                                        sortInverted === true && (
                                            <MdArrowDownward />
                                        )}
                                    {sortColumn?.key === column.key &&
                                        sortInverted === false && <MdArrowUpward />}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {sortedValues.map((value, index) => (
                        <tr key={index}>
                            {columns.map((column) => {
                                return column.isMain ? (
                                    <th scope="row">{value[column.key]}</th>
                                ) : (
                                    <td>{value[column.key]}</td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </Table>
            
            { isLoading &&
                <Row>
                    <Col className="d-flex justify-content-center">
                        <TailSpin stroke="#000000" />
                    </Col>
                </Row>
            }
        </>
    );
};

SortableTable.propTypes = {
    columns: PropTypes.object.isRequired,
    values: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
};

export default SortableTable;
