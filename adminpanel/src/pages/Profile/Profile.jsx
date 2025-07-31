import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { User, Mail, Phone, Save, ImagePlus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchProfile } from "../../utils/profile";
import axios from "axios";
import { notify } from "../../utils/toast";
import { endpoint } from "../../server";

function Profile () {
    return (
        <div>
            <p>
                Profile
            </p>
        </div>
    )
}

export default Profile