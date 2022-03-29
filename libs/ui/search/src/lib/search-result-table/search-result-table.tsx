import styles from "./search-result-table.module.scss";
import {Container, Icon, Label, Sticky, Table, SemanticWIDTHS} from "semantic-ui-react";
import React, {createRef} from "react";
import SearchResultTableSort, {SortOption} from "../search-result-table-sort/search-result-table-sort";
import jp from "jsonpath";
import {FieldDescription} from "../search-result-table-wrapper/search-result-table-wrapper";
import {object} from "prop-types";

interface Props {
  data: Array<Record<string, unknown>>;
  landingPageUrlTemplate?: string;
  landingPageLink?: string;
  fields: Array<FieldDescription>
  handleSetSort: (newValue: SortOption) => void;
  currentSort: SortOption;
}

interface TableCell {
  columnName:string;
  columnWidth:SemanticWIDTHS | undefined;
}



interface CellContentAttributes {
  as: string;
  href?: string;
}

/* eslint-disable-next-line */
export interface SearchResultTableProps {
}

export function SearchResultTable({ data,
                                    landingPageUrlTemplate,
                                    landingPageLink,
                                    fields,
                                    handleSetSort,
                                    currentSort
                                  }: Props) {
  const tableData: Array<Record<string, unknown>> = [];

  function handleChange(newValue: SortOption) {
    handleSetSort(newValue);
  }

  let columnNameArray: Array<TableCell> = []
  for (const element of fields) {
    let cellInfo:TableCell = {
      'columnName':'',
      'columnWidth':undefined
    }
    cellInfo.columnName = element.columnName
    cellInfo.columnWidth = element?.columnWidth
    //columnNameArray.push(element.columnName)
    if(columnNameArray.some(elemArray => elemArray.columnName === element.columnName)){
    } else{
      columnNameArray.push(cellInfo)
    }
  }
  //Remove duplicated columnName
  //columnNameArray = [...new Set(columnNameArray)];

  console.log(data)

  let ref: React.RefObject<HTMLInputElement> = createRef();
  return (
    <Table ref={ref.current} >
      {/*<Sticky context={ref.current} as={'thead'}>*/}
      {/*</Sticky>*/}
      <Table.Header>
        <Table.Row>
          {columnNameArray.map((tableCellInfo: TableCell, i) => (
            <Table.HeaderCell key={i} width={tableCellInfo.columnWidth}>
              {tableCellInfo.columnName}
              {fields.map((fieldsItem: any, k) => {
                let type = ""
                if (fieldsItem.columnJsonPath.endsWith('default')) {
                  type = '.keyword'
                }
                return (
                  (fieldsItem.columnName === tableCellInfo.columnName && (fieldsItem.columnJsonPath === "" || type != "")) ? (
                    <SearchResultTableSort
                      onChange={handleChange}
                      currentSort={currentSort}
                      key={fieldsItem.columnIndex + fieldsItem.columnJsonPath.replace('$', '') + type}
                      field={fieldsItem.columnIndex + fieldsItem.columnJsonPath.replace('$', '') + type}
                    />
                  ) : ("")
                )
              })}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((dataItem: any, index) => (
          <Table.Row key={index}>
            {columnNameArray.map((tableCellInfo: TableCell, j) => (
              <Table.Cell key={j}>
                {fields.map((fieldsItem: any, k) => {
                  let attributes: CellContentAttributes = {
                    as: landingPageLink === fieldsItem.columnIndex ? "a" : "div"
                  };
                  if (landingPageUrlTemplate && landingPageLink === fieldsItem.columnIndex) {
                    attributes.href = landingPageUrlTemplate.replace("{uuid}", dataItem["_id"]);
                  }
                  return (
                    <span key={k}>
                {fieldsItem.columnName === tableCellInfo.columnName? (
                  <Container {...attributes} fluid={true}>
                    {dataItem[fieldsItem.columnIndex] ? (
                        <HtmlType value={dataItem[fieldsItem.columnIndex]} jsonPath={fieldsItem.columnJsonPath}
                                  label={fieldsItem.columnLabel} ribon={fieldsItem.columnRibon}
                                  iconValue={fieldsItem.columnIcon}/>
                    ) : ""}
                    <br/>
                  </Container>
                ) : (
                  ""
                )}
              </span>
                  )
                })}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

interface HtmlTypeProps {
  jsonPath: string;
  value: Object;
  label?: undefined;
  iconValue?: undefined;
  ribon?: Object;
}



function HtmlType({
                    jsonPath,
                    value,
                    label,
                    ribon,
                    iconValue
                  }: HtmlTypeProps) {
  let linkStyle;
  let icon;
  let result;


  if (iconValue) {
    icon = <Icon name={iconValue}/>
  }
  if(jsonPath === '' && value) {
    if (typeof value != "string") {
      linkStyle ='';
      // @ts-ignore
      for(let elem of value){
        let elemlinkStyle =null;
        if (elem.toString().match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
          elemlinkStyle = <React.Fragment><a href={elem.toString()} style={{wordBreak: "break-all"}}> {icon} {elem}</a><br/></React.Fragment>;
        } else {
          elemlinkStyle = <React.Fragment><span> {icon} {elem}</span><br/></React.Fragment>;
        }
        if(linkStyle===''){
          linkStyle = [linkStyle,elemlinkStyle]
        } else {
          linkStyle = [linkStyle,<br/>,elemlinkStyle]
        }
      }
      linkStyle = <React.Fragment>{linkStyle}</React.Fragment>
    }
  if (typeof value === "string") {
      if (value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
        linkStyle =<React.Fragment><a href={value.toString()} style={{wordBreak: "break-all"}}> {icon} {value}</a><br/></React.Fragment>;
      } else {
        linkStyle =<React.Fragment><span> {icon} {value}</span><br/></React.Fragment>;
      }
    }
  }
  else if (jsonPath.endsWith('url')) {
    let url = jp.query(value, jsonPath).toString()
    if (jp.query(value, jsonPath.replace('url', 'name')).length > 0) {
      linkStyle ='';
      for (let i in jp.query(value, jsonPath)){
        let elemlinkStyle =null;
        elemlinkStyle = <React.Fragment> <a href={jp.query(value, jsonPath)[i].toString()}> {icon}
          {jp.query(value, jsonPath.replace('url', 'name'))[i]}
        </a><br/></React.Fragment>;
        if(linkStyle === ''){
          linkStyle = [linkStyle,elemlinkStyle]
        } else {
          linkStyle = [linkStyle,<br/>,elemlinkStyle]
        }
      }
      linkStyle = <React.Fragment>{linkStyle}</React.Fragment>;
    }
    else if (jp.query(value, jsonPath.replace('url', 'title')).length > 0) {
      //TODO to modify depending on the refactoring of the related section
      linkStyle ='';
      for (let i in jp.query(value, jsonPath)){
        let elemlinkStyle =null;
        elemlinkStyle = <React.Fragment><a href={jp.query(value, jsonPath+'.eng')[i].toString()}> {icon}  {jp.query(value, jsonPath.replace('url', 'title.eng'))[i]}</a><br/></React.Fragment>;
        if(linkStyle === ''){
          linkStyle = [linkStyle,elemlinkStyle]
        } else {
          linkStyle = [linkStyle,<br/>,elemlinkStyle]
        }
      }
      linkStyle = <React.Fragment>{linkStyle}</React.Fragment>
    } else {
      if (/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(jp.query(value, jsonPath).toString())) {
        linkStyle = <img alt=""
                         src={jp.query(value, jsonPath).toString()}
                         className={styles.image}/>
      } else {
        linkStyle = <a href={jp.query(value, jsonPath).toString()} style={{wordBreak: "break-all"}}> {icon}
          {jp.query(value, jsonPath)}
        </a>;
      }
    }
  } else {
    if (jp.query(value, jsonPath).toString() != '') {
      linkStyle ='';
      if (jp.query(value, jsonPath).toString().match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {

        for (let i in jp.query(value, jsonPath)){
          let elemlinkStyle =null;
          elemlinkStyle = <React.Fragment><a href={jp.query(value, jsonPath)[i].toString()} style={{wordBreak: "break-all"}}> {icon} {jp.query(value, jsonPath)[i]}</a><br/></React.Fragment>;
          if(linkStyle === ''){
            linkStyle = [linkStyle,elemlinkStyle]
          } else {
            linkStyle = [linkStyle,<br/>,elemlinkStyle]
          }
        }
        linkStyle = <React.Fragment>{linkStyle}</React.Fragment>
      } else {
        for (let i in jp.query(value, jsonPath)){
          let elemlinkStyle =null;
          elemlinkStyle = <React.Fragment><span> {icon} {jp.query(value, jsonPath)[i]}</span><br/></React.Fragment>;
          if(linkStyle === ''){
            linkStyle = [linkStyle,elemlinkStyle]
          } else {
            linkStyle = [linkStyle,<br/>,elemlinkStyle]
          }
        }
        linkStyle = <React.Fragment>{linkStyle}</React.Fragment>
      }
    } else {
      linkStyle = ''
    }
  }

  if (ribon) {
    for (const [key, ribonColor] of Object.entries(ribon)) {
      if (jp.query(value, jsonPath).toString() === key) {
        result =
          <React.Fragment><br/><Label color={ribonColor.toString()} ribbon>{linkStyle}</Label><br/></React.Fragment>
      }
    }
  } else {
    if (label && linkStyle !='') {
      result = <React.Fragment><Label color={label}>{linkStyle}</Label><br/></React.Fragment>
    } else {
      result = linkStyle
    }
  }

  return (
    <span>
      {result}
    </span>
  );
}

export default SearchResultTable;
