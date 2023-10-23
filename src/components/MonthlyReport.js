// import React, { useEffect, useState } from 'react';
// import { Container, Row, Col, Button, Form } from 'react-bootstrap';
// import CanvasJSReact from '@canvasjs/react-charts';
// import CollapsibleExample from './NavbarNew';
// import { database } from './firebase-config';
// import { ref } from 'firebase/database';
// import { query, orderByChild, equalTo, onValue } from 'firebase/database';
// import { useNavigate } from 'react-router-dom';
//
// const CanvasJSChart = CanvasJSReact.CanvasJSChart;
//
// const MonthlyReport = () => {
//     const [chartOptions, setChartOptions] = useState(null);
//     const [selectedMonth, setSelectedMonth] = useState('Styczeń');
//     const [selectedPill, setSelectedPill] = useState('');
//     const [selectedParameter, setSelectedParameter] = useState('');
//     const [pillsData, setPillsData] = useState([]);
//     const [reportData, setReportData] = useState([]);
//
//     useEffect(() => {
//         const options = {
//             animationEnabled: true,
//             title: {
//                 text: 'Miesięczny raport',
//                 font: 'Helvetica Neue Light, HelveticaNeue-Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
//                 fontWeight: 'normal',
//             },
//             axisX: {
//                 title: 'Data',
//             },
//             axisY: {
//                 title: '',
//             },
//             data: [
//                 {
//                     type: 'line',
//                     dataPoints: [],
//                 },
//             ],
//         };
//
//         setChartOptions(options);
//     }, []);
//
//     const months = [
//         'Styczeń',
//         'Luty',
//         'Marzec',
//         'Kwiecień',
//         'Maj',
//         'Czerwiec',
//         'Lipiec',
//         'Sierpień',
//         'Wrzesień',
//         'Październik',
//         'Listopad',
//         'Grudzień',
//     ];
//
//     const parameters = {
//         'Aktywność': 'Aktywność',
//         'Ciśnienie': 'Ciśnienie',
//         'Poziom cukru': 'Poziom',
//         'Sen': 'Sen',
//         'Temperatura': 'Temp',
//         'Waga': 'Waga',
//     };
//
//     const units = {
//         'Aktywność': 'godz.',
//         'Ciśnienie': 'mmHg',
//         'Poziom cukru': 'mg/dl',
//         'Sen': 'godz.',
//         'Temperatura': '°C',
//         'Waga': 'kg',
//     };
//
//     const getUnitForParameter = (parameter) => {
//         return units[parameter] || '';
//     };
//
//     const getUnitForMonths = (month) => {
//         return units[month] || '';
//     };
//
//     const navigate = useNavigate();
//
//     const handleTabletsClick = () => {
//         if (selectedPill) {
//             const selectedPillData = pillsData.find((pill) => pill.name === selectedPill);
//             if (selectedPillData) {
//                 const selectedPillId = selectedPillData.id;
//                 navigate(`/tabletpillsmonthlyreport/${selectedPillId}`);
//                 console.log(selectedPillId);
//             }
//         }
//     };
//
//     useEffect(() => {
//         const pillsRef = ref(database, 'Pills');
//         const userStatsQuery = query(pillsRef, orderByChild('pacient'), equalTo('qjETQt3F6qgSuKTSZtmBv10MJmY2'));
//         onValue(userStatsQuery, (snapshot) => {
//             if (snapshot.exists()) {
//                 const stats = snapshot.val();
//                 const statsArray = Object.values(stats);
//                 setPillsData(statsArray);
//             }
//         });
//     }, [selectedMonth]);
//
//     useEffect(() => {
//         if (pillsData.length > 0 && selectedPill) {
//             const selectedPillData = pillsData.find((pill) => pill.name === selectedPill);
//             if (selectedPillData) {
//                 const updatedData = [
//                     {
//                         label: selectedPillData.name,
//                         y: selectedPillData.frequency,
//                     },
//                 ];
//
//                 const updatedOptions = { ...chartOptions };
//                 updatedOptions.data[0].dataPoints = updatedData;
//                 updatedOptions.axisY.title = '';
//
//                 setChartOptions(updatedOptions);
//             }
//         }
//     }, [pillsData, selectedPill]);
//
//     useEffect(() => {
//         const reportsRef = ref(database, 'report');
//         const userStatsQuery = query(reportsRef, orderByChild('user'), equalTo('qjETQt3F6qgSuKTSZtmBv10MJmY2'));
//         onValue(userStatsQuery, (snapshot) => {
//             if (snapshot.exists()) {
//                 const report = snapshot.val();
//                 const statsArray = Object.values(report);
//                 setReportData(statsArray);
//             }
//         });
//     }, [selectedMonth]);
//
//     useEffect(() => {
//         if (selectedParameter && selectedMonth && reportData.length > 0) {
//             const parameterKey = parameters[selectedParameter];
//             const unit = getUnitForParameter(selectedParameter);
//
//             const monthToNumber = {
//                 Styczeń: '01',
//                 Luty: '02',
//                 Marzec: '03',
//                 Kwiecień: '04',
//                 Maj: '05',
//                 Czerwiec: '06',
//                 Lipiec: '07',
//                 Sierpień: '08',
//                 Wrzesień: '09',
//                 Październik: '10',
//                 Listopad: '11',
//                 Grudzień: '12',
//             };
//
//             const filteredData = reportData.filter((entry) => {
//                 const formattedSelectedMonth = monthToNumber[selectedMonth];
//                 return (
//                     entry.date.includes(`. ${formattedSelectedMonth}.`) &&
//                     typeof entry[parameterKey] !== 'undefined'
//                 );
//             });
//
//             const dataForSelectedParameter = filteredData.map((entry) => ({
//                 x: new Date(entry.date),
//                 y: parseFloat(entry[parameterKey]),
//             }));
//
//             const updatedOptions = { ...chartOptions };
//             updatedOptions.title.text = `Miesięczny raport - ${selectedMonth}`;
//             updatedOptions.axisX.title = 'Data';
//             updatedOptions.data[0].dataPoints = dataForSelectedParameter;
//             updatedOptions.axisY.title = getUnitForParameter(selectedParameter);
//
//             setChartOptions(updatedOptions);
//         }
//     }, [selectedParameter, selectedMonth, reportData]);
//
//     return (
//         <div>
//             <CollapsibleExample />
//             <Container>
//                 <Row className="bg-primary text-white">
//                     <Col>
//                         <h2>Miesięczny raport</h2>
//                     </Col>
//                 </Row>
//             </Container>
//
//             <Container>
//                 <Row>
//                     <div className="bg-light mt-3">
//                         <div className="form-group p-3">
//                             <h4 className="auth-label">Wybierz miesiąc</h4>
//                             <Form>
//                                 <Form.Group controlId="exampleForm.SelectCustom">
//                                     <Form.Control
//                                         as="select"
//                                         custom
//                                         value={selectedMonth}
//                                         onChange={(e) => setSelectedMonth(e.target.value)}
//                                     >
//                                         {months.map((month, index) => (
//                                             <option key={index} value={month}>
//                                                 {month}
//                                             </option>
//                                         ))}
//                                     </Form.Control>
//                                 </Form.Group>
//                             </Form>
//                         </div>
//                     </div>
//                 </Row>
//             </Container>
//
//             <Container>
//                 <Row>
//                     <div className="bg-light mt-3">
//                         <div className="form-group p-3">
//                             <h4 className="auth-label">Wybierz tabletkę do statystyk</h4>
//                             <Form>
//                                 <Form.Group controlId="exampleForm.SelectPill">
//                                     <Form.Control
//                                         as="select"
//                                         custom
//                                         value={selectedPill}
//                                         style={{ width: '100%' }}
//                                         onChange={(e) => setSelectedPill(e.target.value)}
//                                     >
//                                         {pillsData.map((pill, index) => (
//                                             <option key={index} value={pill.name}>
//                                                 {pill.name}
//                                             </option>
//                                         ))}
//                                     </Form.Control>
//                                     <Button
//                                         className="dropdown-btn"
//                                         variant="primary"
//                                         style={{
//                                             background: '#8ed1fc',
//                                             borderRadius: '0.5em',
//                                             fontSize: '18px',
//                                             color: '#fff',
//                                             display: 'flex',
//                                             justifyContent: 'center',
//                                             alignItems: 'center',
//                                             padding: '0.7em 0.5em',
//                                             border: 'none',
//                                             cursor: 'pointer',
//                                             marginTop: '10px',
//                                             width: '100%',
//                                         }}
//                                         onClick={handleTabletsClick}
//                                     >
//                                         TABLETKI
//                                     </Button>
//                                 </Form.Group>
//                             </Form>
//                         </div>
//                     </div>
//                 </Row>
//             </Container>
//
//             <Container>
//                 <Row>
//                     <div className="bg-light mt-3">
//                         <div className="form-group p-3">
//                             <h4 className="auth-label">Wybierz parametr</h4>
//                             <Form>
//                                 <Form.Group controlId="exampleForm.SelectCustom">
//                                     <Form.Control
//                                         as="select"
//                                         custom
//                                         value={selectedParameter}
//                                         style={{ width: '100%' }}
//                                         onChange={(e) => setSelectedParameter(e.target.value)}
//                                     >
//                                         {Object.keys(parameters).map((parameter, index) => (
//                                             <option key={index} value={parameter}>
//                                                 {parameter}
//                                             </option>
//                                         ))}
//                                     </Form.Control>
//                                 </Form.Group>
//                             </Form>
//                         </div>
//                     </div>
//                 </Row>
//             </Container>
//
//             <Container>
//                 <Row>
//                     <div className="bg-light p-3">
//                         <div className="form-group mt-3">
//                             {chartOptions && <CanvasJSChart options={chartOptions} />}
//                             <div style={{ height: 240, textAlign: 'center', color: 'black', fontSize: 15, display: 'none' }}>
//                                 Brak danych do wyświetlenia
//                             </div>
//                         </div>
//                     </div>
//                 </Row>
//             </Container>
//         </div>
//     );
// };
//
// export default MonthlyReport;
