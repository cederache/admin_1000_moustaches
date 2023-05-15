import userIcon from "../assets/img/markers/user-marker-icon.svg";

import iconShadow from "leaflet/dist/images/marker-shadow.png";

import blueIcon from "../assets/img/markers/marker-icon-blue.png";
import redIcon from "../assets/img/markers/marker-icon-red.png";
import yellowIcon from "../assets/img/markers/marker-icon-yellow.png";
import greenIcon from "../assets/img/markers/marker-icon-green.png";

import catIcon from "../assets/img/markers/cat.png";
import kittenIcon from "../assets/img/markers/pram.png";
import dogIcon from "../assets/img/markers/dog.png";
import kittenFeedingIcon from "../assets/img/markers/pram.png";
import puppyIcon from "../assets/img/markers/dog.png";
import rabbitIcon from "../assets/img/markers/rabbit.png";

import L from "leaflet";

// User
export const UserIcon = L.icon({
    iconUrl: userIcon,
    shadowUrl: null,
    iconSize: [100, 100],
    iconAnchor: [50, 50],
});

// Colors
export const BlueIcon = L.icon({
    iconUrl: blueIcon,
    shadowUrl: iconShadow,
    iconSize: [30, 46],
    iconAnchor: [15, 46],
});
export const RedIcon = L.icon({
    iconUrl: redIcon,
    shadowUrl: iconShadow,
    iconSize: [30, 46],
    iconAnchor: [15, 46],
});
export const YellowIcon = L.icon({
    iconUrl: yellowIcon,
    shadowUrl: iconShadow,
    iconSize: [30, 46],
    iconAnchor: [15, 46],
});
export const GreenIcon = L.icon({
    iconUrl: greenIcon,
    shadowUrl: iconShadow,
    iconSize: [30, 46],
    iconAnchor: [15, 46],
});

// Animals
export const CatIcon = L.icon({
    iconUrl: catIcon,
    shadowUrl: null,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
});
export const KittenIcon = L.icon({
    iconUrl: kittenIcon,
    shadowUrl: null,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
});
export const DogIcon = L.icon({
    iconUrl: dogIcon,
    shadowUrl: null,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
});
export const KittenFeedingIcon = L.icon({
    iconUrl: kittenFeedingIcon,
    shadowUrl: null,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
});
export const PuppyIcon = L.icon({
    iconUrl: puppyIcon,
    shadowUrl: null,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
});
export const RabbitIcon = L.icon({
    iconUrl: rabbitIcon,
    shadowUrl: null,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
});
export const NACIcon = L.icon({
    iconUrl: rabbitIcon,
    shadowUrl: null,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
});
