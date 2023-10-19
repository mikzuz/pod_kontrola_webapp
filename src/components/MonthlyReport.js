import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import CanvasJSReact from '@canvasjs/react-charts';
import CollapsibleExample from './NavbarNew';
import { database } from './firebase-config';
import {ref} from "firebase/database"; // Importuj konfigurację Firebase
import {query, orderByChild, equalTo, onValue } from "firebase/database";


const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MonthlyReport = () => {
    const [chartOptions, setChartOptions] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('Styczeń');
    const [pillsData, setPillsData] = useState([]);

    useEffect(() => {
        // Przykładowe opcje dla wykresu
        const options = {
            animationEnabled: true,
            title: {
                text: 'Miesięczny raport',
                font:
                    'Helvetica Neue Light, HelveticaNeue-Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
                fontWeight: 'normal',
            },
            axisX: {
                title: 'Label',
            },
            axisY: {
                title: 'Value',
            },
            data: [
                {
                    type: 'line',
                    dataPoints: [],
                },
            ],
        };

        setChartOptions(options);
    }, []);

    const months = [
        'Styczeń',
        'Luty',
        'Marzec',
        'Kwiecień',
        'Maj',
        'Czerwiec',
        'Lipiec',
        'Sierpień',
        'Wrzesień',
        'Październik',
        'Listopad',
        'Grudzień',
    ];

    useEffect(() => {
        // Tworzenie referencji do węzła "Pills" w bazie danych Firebase Realtime Database
        const pillsRef = ref(database, "Pills");
        const userStatsQuery = query(pillsRef, orderByChild("pacient"), equalTo("qjETQt3F6qgSuKTSZtmBv10MJmY2"));
        onValue(userStatsQuery, (snapshot) => {
            if (snapshot.exists()) {
                const stats = snapshot.val();
                console.log(stats);
                // // Przetwarzanie danych i dodawanie ich do listy
                // const pillsArray = Object.values(data).filter((pill) => pill.pacient === 'xyz');
                // setPillsData(pillsArray);
            }
        });
    }, [selectedMonth]);

    // Aktualizacja danych na wykresie przy zmianie wybranego miesiąca
    useEffect(() => {
        if (pillsData.length > 0) {
            const updatedData = pillsData.map((pill) => ({
                label: pill.name,
                y: pill.frequency,
            }));

            const updatedOptions = { ...chartOptions };
            updatedOptions.data[0].dataPoints = updatedData;

            setChartOptions(updatedOptions);
        }
    }, [pillsData]);

    return (
        <div>
            <CollapsibleExample />
            <Container>
                <Row className="bg-primary text-white">
                    <Col>
                        <h2>Miesięczny raport</h2>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    <div className="form-group mt-3">
                        <Col>
                            <h4>Wybierz miesiąc</h4>
                            <Form>
                                <Form.Group controlId="exampleForm.SelectCustom">
                                    <Form.Control
                                        as="select"
                                        custom
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    >
                                        {months.map((month, index) => (
                                            <option key={index} value={month}>
                                                {month}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Col>
                    </div>
                </Row>
            </Container>

            <Container>
                <Row>
                    <Col>
                        <div className="form-group mt-3">
                            <h4>Wybierz tabletkę do statystyk</h4>
                            <Button variant="primary" disabled>
                                Ładowanie...
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    <Col>
                        <div className="form-group mt-3">
                            <h4>Wybierz parametr do wykresu</h4>
                            <Button variant="primary" disabled>
                                Ładowanie...
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    <Col>
                        {chartOptions && <CanvasJSChart options={chartOptions} />}
                        <div style={{ height: 240, textAlign: 'center', color: 'black', fontSize: 15, display: 'none' }}>
                            Brak danych do wyświetlenia
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MonthlyReport;
