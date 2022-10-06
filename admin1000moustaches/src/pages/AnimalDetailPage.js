import Page from 'components/Page';
import React, { useEffect } from 'react';
import {
    Button,
    Col,
    Input,
    Row,
    Table,
} from 'reactstrap';
import AnimalsManager from '../managers/animals.manager';
import { useState } from 'react';
import {
    MdRefresh,
    MdAssignment
} from 'react-icons/md';
import { useParams } from 'react-router';

function AnimalDetailPage() {
    // const { animalId } = useParams();
    const animalId = 1;
    const [animal, setAnimal] = useState([]);

    const getAnimal = () => {
        AnimalsManager.getById(animalId)
        .then(setAnimal)
    }
    useEffect(() => {
        getAnimal();
    }, []);

    return (
      <Page
        className="AnimalPage"
        title="Animal"
        breadcrumbs={[{ name: 'Animals', active: true }, { name: 'Animal', active: false }]}
      >
        <Row>
            <Col xs={{span: 1, offset: 11}}>
                <Button onClick={getAnimal}><MdRefresh/></Button>
            </Col>
        </Row>

        <Row>
            <Col xs={12}>
                {animal.name}
            </Col>
        </Row>
      </Page>
    );
}
export default AnimalDetailPage;
