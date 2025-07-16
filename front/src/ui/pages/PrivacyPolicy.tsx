import React from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Badge,
    Alert,
    ListGroup,
    ListGroupItem,
    List
} from 'reactstrap';

const PrivacyPolicy = () => {
    return (
        <Container className="py-5">
            <Row className="justify-content-left">
                <Col lg={10} xl={8}>
                    <Card className="shadow-lg border-0">
                        <CardBody className="p-5">
                            <div className="text-center mb-5">
                                <h1 className="display-4 text-primary mb-3">Mentions légales</h1>
                                <Badge color="info" pill className="fs-6 px-4 py-2 text-dark" >
                                    <span className="text-black fw-bold"> Site dédié aux bénévoles de l'association 1000 Moustaches</span>
                                </Badge>
                            </div>

                            <Alert color="warning" className="border-0 rounded-3">
                                <h6 className="alert-heading mb-2 fw-bold">
                                    <i className="fas fa-lock me-2"></i>
                                    Accès restreint
                                </h6>
                                <span className="text-black">L'accès à ce site est strictement limité aux bénévoles autorisés de l'association.
                                    Les droits d'accès sont différenciés selon le rôle et les responsabilités de chaque bénévole.</span>
                            </Alert>

                            <section className="mb-5">
                                <h2 className="h3 text-primary border-bottom border-primary pb-2 mb-4">
                                    1. Identification de l'éditeur
                                </h2>
                                <Card className="bg-light border-0">
                                    <CardBody>
                                        <Row>
                                            <Col md={6}>
                                                <ListGroup flush>
                                                    <ListGroupItem className="bg-transparent px-0">
                                                        <strong>Nom de l'association :</strong><br />
                                                        1000 Moustaches
                                                    </ListGroupItem>
                                                    <ListGroupItem className="bg-transparent px-0">
                                                        <strong>Forme juridique :</strong><br />
                                                        Association loi 1901
                                                    </ListGroupItem>
                                                    <ListGroupItem className="bg-transparent px-0">
                                                        <strong>Numéro RNA :</strong><br />
                                                        W442024920
                                                    </ListGroupItem>
                                                    <ListGroupItem className="bg-transparent px-0">
                                                        <strong>Numéro SIREN :</strong><br />
                                                        882620628
                                                    </ListGroupItem>
                                                </ListGroup>
                                            </Col>
                                            <Col md={6}>
                                                <ListGroup flush>
                                                    <ListGroupItem className="bg-transparent px-0">
                                                        <strong>Siège social :</strong><br />
                                                        37 RUE DES COLVERTS 44118 LA CHEVROLIERE
                                                    </ListGroupItem>
                                                    <ListGroupItem className="bg-transparent px-0">
                                                        <strong>Téléphone :</strong><br />
                                                        07 81 52 54 55
                                                    </ListGroupItem>
                                                    <ListGroupItem className="bg-transparent px-0">
                                                        <strong>Email :</strong><br />
                                                        1000moustaches@gmail.com
                                                    </ListGroupItem>
                                                    <ListGroupItem className="bg-transparent px-0">
                                                        <strong>Responsable de la publication :</strong><br />
                                                        Madame Voisin Lola
                                                    </ListGroupItem>
                                                </ListGroup>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </section>

                            <section className="mb-5">
                                <h2 className="h3 text-primary border-bottom border-primary pb-2 mb-4">
                                    2. Hébergement du site
                                </h2>
                                <Card className="bg-light border-0">
                                    <CardBody>
                                        <p><strong>Hébergeur :</strong> <span className="text-danger fw-bold">[Nom de l'hébergeur]</span></p>
                                        <p><strong>Adresse :</strong> <span className="text-danger fw-bold">[Adresse de l'hébergeur]</span></p>
                                        <p className="mb-0"><strong>Téléphone :</strong> <span className="text-danger fw-bold">[Téléphone de l'hébergeur]</span></p>
                                    </CardBody>
                                </Card>
                            </section>

                            <section className="mb-5">
                                <h2 className="h3 text-primary border-bottom border-primary pb-2 mb-4">
                                    3. Objet et nature du site
                                </h2>
                                <p className="text-justify">
                                    Ce site est un outil interne destiné exclusivement aux bénévoles autorisés de l'association{' '}
                                    <span className="text-primary fw-bold">1000 Moustaches</span>. Il a pour objectif de faciliter
                                    la gestion et le suivi des animaux pris en charge par l'association, ainsi que la coordination
                                    avec les familles d'accueil et les vétérinaires partenaires.
                                </p>
                            </section>

                            <section className="mb-5">
                                <h2 className="h3 text-primary border-bottom border-primary pb-2 mb-4">
                                    4. Protection des données personnelles (RGPD)
                                </h2>

                                <div className="mb-4">
                                    <h3 className="h5 text-secondary mb-3">4.1 Responsable du traitement</h3>
                                    <p>
                                        L'association <span className="text-primary fw-bold">1000 Moustaches</span> est responsable
                                        du traitement des données personnelles collectées sur ce site.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="h5 text-secondary mb-3">4.2 Finalités du traitement</h3>
                                    <p>Les données personnelles sont collectées et traitées pour les finalités suivantes :</p>
                                    <Card className="bg-light border-0">
                                        <CardBody>
                                            <List flush>
                                                <li className="bg-transparent px-0">
                                                    <i className="fas fa-paw text-primary me-2"></i>
                                                    Gestion des animaux de l'association (suivi médical, comportemental, adoptions)
                                                </li>
                                                <li className="bg-transparent px-0">
                                                    <i className="fas fa-home text-primary me-2"></i>
                                                    Coordination avec les familles d'accueil (contact, suivi, évaluations)
                                                </li>
                                                <li className="bg-transparent px-0">
                                                    <i className="fas fa-stethoscope text-primary me-2"></i>
                                                    Gestion des relations avec les vétérinaires partenaires
                                                </li>
                                                <li className="bg-transparent px-0">
                                                    <i className="fas fa-users text-primary me-2"></i>
                                                    Administration du site et gestion des accès des bénévoles
                                                </li>
                                            </List>
                                        </CardBody>
                                    </Card>
                                </div>

                                <div className="mb-4">
                                    <h3 className="h5 text-secondary mb-3">4.3 Base légale</h3>
                                    <p>
                                        Le traitement des données est fondé sur l'intérêt légitime de l'association pour mener à bien
                                        ses missions de protection animale et sur le consentement des personnes concernées.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="h5 text-secondary mb-3">4.4 Destinataires des données</h3>
                                    <p>
                                        Les données sont accessibles uniquement aux bénévoles autorisés de l'association, selon leur
                                        niveau d'habilitation. Elles peuvent être partagées avec les vétérinaires partenaires dans le
                                        cadre des soins aux animaux.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="h5 text-secondary mb-3">4.5 Durée de conservation</h3>
                                    <p>
                                        Les données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont
                                        été collectées, et conformément aux obligations légales applicables.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="h5 text-secondary mb-3">4.6 Droits des personnes</h3>
                                    <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                                    <Alert color="info" className="border-0">
                                        <Row>
                                            <Col md={6}>
                                                <ListGroup flush>
                                                    <ListGroupItem className="bg-transparent px-0 border-0">
                                                        <i className="fas fa-eye text-info me-2"></i>
                                                        Droit d'accès à vos données
                                                    </ListGroupItem>
                                                    <ListGroupItem className="bg-transparent px-0 border-0">
                                                        <i className="fas fa-edit text-info me-2"></i>
                                                        Droit de rectification
                                                    </ListGroupItem>
                                                    <ListGroupItem className="bg-transparent px-0 border-0">
                                                        <i className="fas fa-trash text-info me-2"></i>
                                                        Droit d'effacement
                                                    </ListGroupItem>
                                                </ListGroup>
                                            </Col>
                                            <Col md={6}>
                                                <ListGroup flush>
                                                    <ListGroupItem className="bg-transparent px-0 border-0">
                                                        <i className="fas fa-download text-info me-2"></i>
                                                        Droit à la portabilité
                                                    </ListGroupItem>
                                                    <ListGroupItem className="bg-transparent px-0 border-0">
                                                        <i className="fas fa-pause text-info me-2"></i>
                                                        Droit à la limitation
                                                    </ListGroupItem>
                                                    <ListGroupItem className="bg-transparent px-0 border-0">
                                                        <i className="fas fa-ban text-info me-2"></i>
                                                        Droit d'opposition
                                                    </ListGroupItem>
                                                </ListGroup>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <p className="mb-0">
                                            <strong>Pour exercer ces droits, contactez :</strong>{' '}
                                            <span className="fw-bold">cedric.derache@gmail.com</span>
                                        </p>
                                    </Alert>
                                </div>
                            </section>

                            <section className="mb-5">
                                <h2 className="h3 text-primary border-bottom border-primary pb-2 mb-4">
                                    5. Propriété intellectuelle
                                </h2>
                                <p>
                                    L'ensemble du contenu de ce site (textes, images, logos, structure) est protégé par les droits
                                    d'auteur et appartient à l'association <span className="text-primary fw-bold">1000 Moustaches</span> ou
                                    à ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable.
                                </p>
                            </section>

                            <section className="mb-5">
                                <h2 className="h3 text-primary border-bottom border-primary pb-2 mb-4">
                                    6. Responsabilité et utilisation du site
                                </h2>

                                <div className="mb-4">
                                    <h3 className="h5 text-secondary mb-3">6.1 Utilisation conforme</h3>
                                    <p>
                                        Ce site doit être utilisé exclusivement dans le cadre des activités de l'association et dans
                                        le respect de la confidentialité des informations.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="h5 text-secondary mb-3">6.2 Confidentialité</h3>
                                    <Alert color="danger" className="border-0">
                                        <h6 className="alert-heading mb-2">
                                            <i className="fas fa-exclamation-triangle"></i>
                                            Obligation de confidentialité
                                        </h6>
                                        <span className="fw-bold"> Les bénévoles s'engagent à ne pas divulguer les informations personnelles et sensibles
                                            accessibles sur ce site à des tiers non autorisés. </span>

                                    </Alert>
                                </div>

                                <div className="mb-4">
                                    <h3 className="h5 text-secondary mb-3">6.3 Sécurité des accès</h3>
                                    <p>
                                        Chaque bénévole est responsable de la sécurité de ses identifiants de connexion et s'engage
                                        à les garder confidentiels.
                                    </p>
                                </div>
                            </section>

                            <section className="mb-5">
                                <h2 className="h3 text-primary border-bottom border-primary pb-2 mb-4">
                                    7. Cookies et technologies similaires
                                </h2>
                                <p>
                                    Ce site utilise des cookies techniques nécessaires à son fonctionnement (authentification, session).
                                    Aucun cookie de traçage ou publicitaire n'est utilisé.
                                </p>
                            </section>

                            <section className="mb-5">
                                <h2 className="h3 text-primary border-bottom border-primary pb-2 mb-4">
                                    8. Droit applicable et juridiction
                                </h2>
                                <p>
                                    Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux
                                    français seront seuls compétents.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h2 className="h3 text-primary border-bottom border-primary pb-2 mb-4">
                                    9. Modification des mentions légales
                                </h2>
                                <p>
                                    Ces mentions légales peuvent être modifiées à tout moment. Les bénévoles seront informés de
                                    toute modification importante.
                                </p>
                            </section>

                            <div className="text-center pt-4 border-top">
                                <p className="text-muted mb-1">
                                    <strong>Dernière mise à jour :</strong> <span className="text-primary fw-bold">Juillet 2025</span>
                                </p>
                                <p className="text-muted mb-0">
                                    © <span className="text-primary fw-bold">2025</span> - <span className="text-primary fw-bold">1000 Moustaches</span> - Tous droits réservés
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PrivacyPolicy;