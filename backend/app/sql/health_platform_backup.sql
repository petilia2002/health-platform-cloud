--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access_predictions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.access_predictions (
    id integer NOT NULL,
    creation_date timestamp without time zone NOT NULL,
    update_date timestamp without time zone NOT NULL,
    access_status character varying NOT NULL,
    prediction_id integer NOT NULL,
    request_id integer NOT NULL,
    doctor_comment character varying,
    comment_date timestamp without time zone
);


ALTER TABLE public.access_predictions OWNER TO postgres;

--
-- Name: access_predictions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.access_predictions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.access_predictions_id_seq OWNER TO postgres;

--
-- Name: access_predictions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.access_predictions_id_seq OWNED BY public.access_predictions.id;


--
-- Name: analytes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analytes (
    id integer NOT NULL,
    name character varying NOT NULL,
    full_name character varying NOT NULL,
    description character varying,
    view_name character varying NOT NULL,
    loinc_code character varying,
    units character varying NOT NULL,
    min_val numeric(7,2) NOT NULL,
    max_val numeric(7,2) NOT NULL
);


ALTER TABLE public.analytes OWNER TO postgres;

--
-- Name: analytes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analytes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.analytes_id_seq OWNER TO postgres;

--
-- Name: analytes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analytes_id_seq OWNED BY public.analytes.id;


--
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id integer NOT NULL,
    place_employment character varying(50) NOT NULL,
    post character varying(50) NOT NULL,
    specialization character varying(50) NOT NULL,
    education character varying,
    experience character varying,
    bio character varying,
    raiting numeric(3,1),
    user_id integer NOT NULL
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- Name: doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.doctors_id_seq OWNER TO postgres;

--
-- Name: doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctors_id_seq OWNED BY public.doctors.id;


--
-- Name: expertise_areas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expertise_areas (
    id integer NOT NULL,
    name character varying NOT NULL,
    doctor_id integer NOT NULL
);


ALTER TABLE public.expertise_areas OWNER TO postgres;

--
-- Name: expertise_areas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expertise_areas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.expertise_areas_id_seq OWNER TO postgres;

--
-- Name: expertise_areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expertise_areas_id_seq OWNED BY public.expertise_areas.id;


--
-- Name: genders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genders (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.genders OWNER TO postgres;

--
-- Name: genders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genders_id_seq OWNER TO postgres;

--
-- Name: genders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genders_id_seq OWNED BY public.genders.id;


--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    height integer,
    weight integer,
    bmi numeric(4,2),
    blood_type character varying,
    user_id integer NOT NULL
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.patients_id_seq OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- Name: prediction_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prediction_results (
    id integer NOT NULL,
    title character varying NOT NULL,
    conclusion character varying NOT NULL,
    probability numeric(6,4) NOT NULL,
    analyte_id integer NOT NULL,
    prediction_id integer NOT NULL
);


ALTER TABLE public.prediction_results OWNER TO postgres;

--
-- Name: prediction_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prediction_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.prediction_results_id_seq OWNER TO postgres;

--
-- Name: prediction_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prediction_results_id_seq OWNED BY public.prediction_results.id;


--
-- Name: predictions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.predictions (
    id integer NOT NULL,
    description character varying,
    creation_date timestamp without time zone NOT NULL,
    sample_id integer NOT NULL,
    update_date timestamp without time zone
);


ALTER TABLE public.predictions OWNER TO postgres;

--
-- Name: predictions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.predictions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.predictions_id_seq OWNER TO postgres;

--
-- Name: predictions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.predictions_id_seq OWNED BY public.predictions.id;


--
-- Name: request_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_statuses (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.request_statuses OWNER TO postgres;

--
-- Name: request_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_statuses_id_seq OWNER TO postgres;

--
-- Name: request_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_statuses_id_seq OWNED BY public.request_statuses.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    creation_date timestamp without time zone NOT NULL,
    update_date timestamp without time zone NOT NULL,
    status_id integer NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.requests_id_seq OWNER TO postgres;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sample_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sample_results (
    id integer NOT NULL,
    value numeric(6,2) NOT NULL,
    analyte_id integer NOT NULL,
    sample_id integer NOT NULL
);


ALTER TABLE public.sample_results OWNER TO postgres;

--
-- Name: sample_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sample_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sample_results_id_seq OWNER TO postgres;

--
-- Name: sample_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sample_results_id_seq OWNED BY public.sample_results.id;


--
-- Name: samples; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.samples (
    id integer NOT NULL,
    upload_date timestamp without time zone NOT NULL,
    update_date timestamp without time zone NOT NULL,
    patient_id integer NOT NULL
);


ALTER TABLE public.samples OWNER TO postgres;

--
-- Name: samples_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.samples_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.samples_id_seq OWNER TO postgres;

--
-- Name: samples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.samples_id_seq OWNED BY public.samples.id;


--
-- Name: statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statuses (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.statuses OWNER TO postgres;

--
-- Name: statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.statuses_id_seq OWNER TO postgres;

--
-- Name: statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.statuses_id_seq OWNED BY public.statuses.id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens (
    id integer NOT NULL,
    refresh_token character varying(512) NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.tokens OWNER TO postgres;

--
-- Name: tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tokens_id_seq OWNER TO postgres;

--
-- Name: tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tokens_id_seq OWNED BY public.tokens.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(512) NOT NULL,
    activation_link character varying(512) NOT NULL,
    is_activated boolean NOT NULL,
    registration_date timestamp without time zone NOT NULL,
    last_name character varying NOT NULL,
    first_name character varying NOT NULL,
    middle_name character varying NOT NULL,
    birth_date date NOT NULL,
    gender_id integer NOT NULL,
    city character varying,
    phone character varying,
    photo character varying(512),
    status_id integer NOT NULL,
    role_id integer NOT NULL,
    icon character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: access_predictions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_predictions ALTER COLUMN id SET DEFAULT nextval('public.access_predictions_id_seq'::regclass);


--
-- Name: analytes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytes ALTER COLUMN id SET DEFAULT nextval('public.analytes_id_seq'::regclass);


--
-- Name: doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors ALTER COLUMN id SET DEFAULT nextval('public.doctors_id_seq'::regclass);


--
-- Name: expertise_areas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expertise_areas ALTER COLUMN id SET DEFAULT nextval('public.expertise_areas_id_seq'::regclass);


--
-- Name: genders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genders ALTER COLUMN id SET DEFAULT nextval('public.genders_id_seq'::regclass);


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Name: prediction_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prediction_results ALTER COLUMN id SET DEFAULT nextval('public.prediction_results_id_seq'::regclass);


--
-- Name: predictions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predictions ALTER COLUMN id SET DEFAULT nextval('public.predictions_id_seq'::regclass);


--
-- Name: request_statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_statuses ALTER COLUMN id SET DEFAULT nextval('public.request_statuses_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: sample_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_results ALTER COLUMN id SET DEFAULT nextval('public.sample_results_id_seq'::regclass);


--
-- Name: samples id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.samples ALTER COLUMN id SET DEFAULT nextval('public.samples_id_seq'::regclass);


--
-- Name: statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuses ALTER COLUMN id SET DEFAULT nextval('public.statuses_id_seq'::regclass);


--
-- Name: tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens ALTER COLUMN id SET DEFAULT nextval('public.tokens_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: access_predictions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.access_predictions (id, creation_date, update_date, access_status, prediction_id, request_id, doctor_comment, comment_date) FROM stdin;
16	2025-11-06 18:26:10.628107	2025-11-14 22:18:36.503589	Активный	5	71	При анализе биохимических показателей обращает на себя внимание положительный результат по ферритину с вероятностью 20.48%, что может свидетельствовать о начальных проявлениях железодефицитной анемии.\r\nРекомендую выполнить общий анализ крови с определением гемоглобина, эритроцитов, цветного показателя, а также исследование сывороточного железа и общей железосвязывающей способности сыворотки.\r\nПациенту показана консультация терапевта для определения дальнейшей тактики обследования и возможной коррекции выявленных изменений.	2025-11-06 18:44:19.337309
26	2025-11-24 19:00:29.567467	2025-12-03 20:19:22.730914	Активный	31	73	Рекомендую выполнить общий анализ крови с определением гемоглобина, эритроцитов, цветного показателя, а также исследование сывороточного железа и общей железосвязывающей способности сыворотки.	2025-12-03 20:19:22.730657
22	2025-11-14 22:15:59.55449	2025-11-14 22:18:50.729466	Завершено	6	71	\N	\N
11	2025-10-22 13:33:04.342471	2025-10-22 13:33:04.342475	Активный	4	41	\N	\N
12	2025-10-22 13:34:43.42666	2025-10-22 13:34:43.426664	Активный	4	42	\N	\N
13	2025-10-22 14:06:53.08598	2025-10-22 14:06:53.085985	Активный	5	42	\N	\N
14	2025-11-06 17:44:16.046871	2025-11-06 17:45:00.978837	Завершено	4	70	\N	\N
23	2025-11-15 00:00:10.164574	2025-11-15 00:00:16.549508	Завершено	6	73	\N	\N
25	2025-11-24 19:00:16.94448	2025-11-24 19:00:23.495565	Завершено	31	73	\N	\N
17	2025-11-12 15:09:55.420643	2025-11-14 20:05:47.063724	Завершено	6	71	\N	\N
24	2025-11-15 00:00:20.987323	2025-12-22 22:17:07.429633	Активный	6	73	На основании проведенного анализа данных, риск развития указанных патологий по представленным показателям оценивается как низкий.\nВ целом, прогноз благоприятный. Для его сохранения целесообразно вести здоровый образ жизни и проходить плановые диспансерные обследования.	2025-12-22 22:17:07.429376
18	2025-11-14 20:36:25.745295	2025-11-14 20:36:38.229745	Завершено	6	71	\N	\N
19	2025-11-14 20:36:46.196517	2025-11-14 22:15:00.810998	Завершено	6	71	\N	\N
20	2025-11-14 22:15:09.628453	2025-11-14 22:15:17.354437	Завершено	6	71	\N	\N
21	2025-11-14 22:15:23.020411	2025-11-14 22:15:56.758985	Завершено	6	71	\N	\N
15	2025-11-06 18:11:05.535846	2025-11-14 22:16:28.125918	Активный	4	71	Ваше здоровье в порядке!	2025-11-06 18:25:47.998999
\.


--
-- Data for Name: analytes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analytes (id, name, full_name, description, view_name, loinc_code, units, min_val, max_val) FROM stdin;
1	Ферритин (Ferritin)	Исследование уровня ферритина в крови	Самый информативный индикатор запасов железа в организме, основная форма депонированного железа.	ferritin	20567-4	нг/мл, мкг/л	0.01	1691.00
2	Витамин B12 (Cobalamin)	Исследование уровня витамина B12	Исследование содержания витамина B12 в сыворотке крови используют для выявления причин анемии (при снижении числа эритроцитов и повышенном среднем объеме), нейропатии, в контроле лечения витамин B12- и фолиеводефицитной анемии.	b12	2132-9	пг/мл	1.00	39833.00
3	Фолиевая кислота (Витамин В9)	Исследование уровня фолиевой кислоты	Витамин, необходимый для нормального синтеза ДНК и процессов кроветворения. Тест применяют преимущественно в диагностике анемии в комплексе с витамином В12.	folic	2284-8	нг/мл	0.56	330.11
4	АСТ (AST)	Определение активности аспартатаминотрансферазы в крови	Определение уровня АСТ в крови используют преимущественно в диагностике и контроле течения болезней печени, а также в комплексных биохимических исследованиях.	ast	1920-8	Ед/л	0.30	1518.50
5	АЛТ (ALT)	Определение активности аланинаминотрансферазы в крови	Определение уровня АЛТ в сыворотке крови применяют преимущественно в диагностике и контроле течения болезней печени, а также в комплексных биохимических исследованиях.	alt	1742-6	Ед/л	0.10	1721.40
6	Билирубин прямой (Bilirubin direct)	Исследование уровня связанного билирубина в крови	Билирубин прямой – это водорастворимая конъюгированная форма билирубина, образуемая в печени и выводимая с желчью. Тест применяют для оценки функции печени, в дифференциальной диагностике желтух. 	bil_direct	29760-6	мкмоль/л	0.04	242.10
7	Билирубин непрямой (Bilirubin indirect)	Исследование уровня свободного билирубина в крови	Анализ на непрямой билирубин позволяет выявить наличие нарушений, связанных с разрушением эритроцитов, проблемами в работе печени или желчевыводящих путей.	bil_indirect	14630-8	мкмоль/л	0.05	221.69
8	Билирубин общий (Bilirubin total)	Исследование уровня общего билирубина в крови	Определение билирубина в сыворотке крови используют для выявления поражений печени различного происхождения, закупорки желчных путей, гемолитической анемии, желтухи новорожденных.	bil_total	54363-7	мкмоль/л	0.03	434.17
9	Креатинин (Creatinine)	Определение уровня креатинина в крови	Уровень креатинина в сыворотке/плазме крови используют в качестве маркера скорости клубочковой фильтрации (СКФ) в почках – в диагностике острых и хронических нарушений функции почек; для оценки функции почек при принятии решений о дозировке лекарственных препаратов, выводимых почками, или перед применением препаратов, которые могут оказать неблагоприятное воздействие на почки.	crea	14682-9	мкмоль/л	0.30	1618.80
10	Мочевина (Urea)	Определение уровня мочевины в крови	Исследование уровня мочевины в крови используют для оценки выделительной функции почек и контроля эффективности лечения пациентов с патологией почек.	urea	22664-7	ммоль/л	0.50	67.00
11	Общий белок (Protein total)	Исследование уровня общего белка в крови	Определение уровня общего белка в сыворотке крови используют в целях диагностики и контроля течения различных заболеваний, включая патологию печени, почек, желудочно-кишечного тракта, онкологические заболевания, нарушения питания и метаболизма и пр.	pro	13980-8	г/л	19.20	132.10
12	ЛДГ (LDH)	Определение уровня ЛДГ в крови	Определение ЛДГ – один из основных ферментативных тестов в лабораторной диагностике инфаркта миокарда.	ldg	2532-0	Ед/л	2.00	4983.00
13	Холестерин (Cholesterol)	Исследование уровня холестерина в крови	Уровень холестерина отражает активность процессов синтеза в печени.	chol	14647-2	ммоль/л	0.02	16.07
14	Глюкоза (Glucose)	Исследование уровня глюкозы в крови	Основной лабораторный тест для оценки углеводного обмена. Исследование направлено на выявление или оценку риска развития сахарного диабета и других заболеваний, связанных с нарушением обмена углеводов.	glu	14771-0	ммоль/л	0.01	26.76
15	Мочевая кислота (Uric acid)	Определение уровня мочевой кислоты в крови	Определение мочевой кислоты в крови используют в диагностике патологии почек, с целью выявления причин мочекаменной болезни, при диагностике и контроле лечения подагры, мониторинге пациентов, получающих цитотоксические препараты, и др.	uric	14933-6	ммоль/л	0.00	1.22
16	Альбумин (Albumin)	Анализ на уровень альбумина в крови	Определение концентрации альбумина обычно используют в целях первичного диагностического скрининга и последующего мониторинга пациентов с заболеваниями печени, и почек, тяжелыми травмами и ожогами, онкологическими заболеваниями; для оценки белкового баланса; дифференциальной диагностики причин отечного синдрома.	alb	1751-7	г/л	0.04	60.14
17	Гемоглобин (Hemoglobin)	Гемоглобин общий, массовая концентрация в крови	Определение концентрации гемоглобина в крови играет важнейшую роль в диагностике анемий.	hgb	30350-3	г/л	11.00	215.00
18	Эритроциты (RBC)	Количество эритроцитов в крови (RBC)	Снижение количества эритроцитов в крови является одним из критериев анемии. Повышение количества эритроцитов в крови — эритроцитоз — один из характерных лабораторных признаков эритремии.	rbc	789-8	10¹²/л	0.24	8.21
19	Средний корпускулярный объём (MCV)	Средняя величина объема эритроцитов (MCV)	Изменения MCV могут дать полезную информацию о нарушениях водно-электролитного баланса. Повышенное значение MCV свидетельствует о гипотоническом характере нарушений водно-электролитного баланса, тогда как понижение — о гипертоническом характере.	mcv	71829-6	фл	0.70	134.00
20	Лейкоциты (WBC)	Количество лейкоцитов (WBC) в циркулирующей крови	Лейкоциты — клетки крови, образующиеся в костном мозге и лимфатических узлах. Основной функцией лейкоцитов является защита организма от чужеродных агентов.	wbc	804-5	10⁹/л	0.10	68.50
21	Тромбоциты (PLT)	Количество тромбоцитов (PLT) в крови	Тромбоциты выполняют ангиотрофическую, адгезивно-агрегационную функции, участвуют в процессах свертывания и фибринолиза, обеспечивают ретракцию кровяного сгустка.	plt	777-3	10⁹/л	1.00	1058.00
22	Нейтрофилы (Neutrophils)	Анализ на уровень нейтрофилов в крови	Основная функция нейтрофилов состоит в защите организма от инфекций, которая осуществляется главным образом с помощью фагоцитоза.	neut	768-2	%	2.90	100.00
23	Лимфоциты (Lymphocytes)	Анализ на уровень лимфоцитов в крови	Главная функция лимфоцитов состоит в узнавании чужеродного антигена и участии в адекватном иммунологическом ответе организма.	lymph	737-7	%	0.10	90.70
24	Эозинофилы (Eosinophils)	Анализ на уровень эозинофилов в крови	Эозинофилы — клетки, фагоцитирующие комплексы антиген—антитело, представленные главным образом иммуноглобулином Е.	eo	711-2	%	0.09	43.90
25	Базофилы (Basophils)	Анализ на уровень базофилов в крови	Главная функция базофилов заключается в участии в реакциях гиперчувствительности немедленного типа. Они также участвуют в реакциях гиперчувствительности замедленного типа через лимфоциты, в воспалительных и аллергических реакциях, в регуляции проницаемости сосудистой стенки.	baso	704-7	%	0.02	27.20
26	Моноциты (Monocytes)	Анализ на уровень моноцитов в крови	Моноцитоз — увеличение числа моноцитов в крови — сопровождает большое количество различных заболеваний. При туберкулезе появление моноцитоза считается доказательством активного распространения туберкулезного процесса.	mono	5905-5	%	0.10	55.40
27	С-реактивный белок (CRP)	Исследование уровня СРБ в крови	Повышение уровня С-реактивного белка используют как индикатор воспалительных процессов для оценки течения ревматоидного артрита и болезни Крона.	crp	1988-5	мг/л	0.01	250.95
28	Средние клетки (Middle cells)	Определение процентного содержания средних клеток в крови	Средние клетки (Middle cells) в анализе крови — это показатель, который обозначает смесь моноцитов, эозинофилов, базофилов и незрелых клеток. Эти клетки циркулируют в крови в небольших количествах, поэтому нередко их объединяют в одну группу.	mid	\N	%	1.20	29.40
29	Гранулоциты (Granulocytes)	Определение процентного содержания гранулоцитов в крови	Гранулоциты — разновидность лейкоцитов, белых кровяных клеток, которые играют ключевую роль в защите организма от инфекций.	gra	\N	%	14.70	94.70
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, place_employment, post, specialization, education, experience, bio, raiting, user_id) FROM stdin;
3	Медицинский центр "Ланта"	Врач-гастроэнтеролог	Гастроэнтеролог	Дальневосточный государственный медицинский университет, по специальности- Лечебное дело, квалификация-Врач, 2010	7 лет	Диагностика и лечение кислотозависимых заболеваний желудочно-кишечного тракта	\N	5
4	Медицинский центр "ЛайфКлиник"	Врач-терапевт	Терапевт	Дальневосточный государственный медицинский университет Федерального агентства по здравоохранению и социальному развитию, по специальности «Лечебное дело», квалификация-Врач, 2005	8 лет	Первичный осмотр пациентов и постановка предварительного диагноза	\N	6
5	Сеть лабораторий "ИНВИТРО"	Врач-терапевт	Терапевт	Диплом о профессиональной переподготовке, по специальности «Кардиология», квалификация Врач-кардиолог, КГБОУЗ ДПО ИПКСЗ, 2015	10 лет	Диагностика, лечение и профилактика заболеваний внутренних органов	\N	7
6	Клиника "МКС"	Врач-кардиолог	Кардиолог	Периодическая аккредитация специалистов по кардиологии 7722 029829573  от 26.09.2023	12 лет	Высшая квалификационная категория по кардиологии	\N	8
7	Клиника "МКС"	Врач-кардиолог	Кардиолог	Действующий сертификат «Кардиология», ФГБОУ ДПО ДВГМУ, 2020	15 лет	Диагностика, комплексная амбулаторная терапия и профилактика сердечно-сосудистых заболеваний	\N	9
8	Медицинский центр "НВ-МЕДИКА"	Врач-онколог	Онколог	Периодическая аккредитация специалистов по онкологии, протокол 7722 012884424 от 23.06.2022	8 лет	Диагностика, лечение и профилактика онкологических заболеваний (злокачественных опухолей)	\N	10
9	Медицинский центр "НВ-МЕДИКА"	Врач-онколог	Онколог	Благовещенский государственный медицинский институт, по специальности «Лечебное дело», квалификация-Врач-лечебник, 1986	30 лет	Высшая квалификационная категория по онкологии	\N	11
10	Сеть лабораторий "ИНВИТРО"	Врач-эндокринолог	Эндокринолог	Санкт-Петербургский государственный университет», квалификация – гастроэнтерология.	5 лет	Диагностика, лечение и профилактика заболеваний эндокринной системы	\N	12
11	Медицинский центр "ЛайфКлиник"	Врач-эндокринолог	Эндокринолог	Диплом о профессиональной переподготовке, по специальности «Андрология», квалификация- Врач- Андролог, Медицинская академия, г. Санкт-Петербург, 2003	25 лет	Диагностика, лечение и профилактика заболеваний эндокринной системы	\N	13
16	Медицинский центр "Ланта"	Врач-невролог	Невролог	Амурская государственная медицинская академия, по специальности «Лечебное дело», квалификация-Врач, 2014	5 лет	Диагностика, терапия и профилактика заболеваний центральной и периферической нервной системы	\N	18
\.


--
-- Data for Name: expertise_areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expertise_areas (id, name, doctor_id) FROM stdin;
\.


--
-- Data for Name: genders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genders (id, name) FROM stdin;
1	Мужчина
2	Женщина
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, height, weight, bmi, blood_type, user_id) FROM stdin;
4	175	68	22.20	I+	21
5	172	65	22.00	II+	22
6	167	59	21.20	III-	23
7	165	70	25.70	IV+	24
1	181	72	22.00	II+	1
8	\N	\N	\N	\N	25
\.


--
-- Data for Name: prediction_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prediction_results (id, title, conclusion, probability, analyte_id, prediction_id) FROM stdin;
4	Prognosis of low ferritin level	positive	0.1580	1	4
5	Prognosis of low ferritin level	positive	0.2048	1	5
6	Prognosis of high glucose level	negative	0.0110	14	5
7	Prognosis of high cholesterol level	negative	0.1924	13	5
8	Prognosis of high uric acid level	negative	0.0601	15	5
9	Prognosis of low ferritin level	negative	0.0119	1	6
10	Prognosis of high glucose level	negative	0.0081	14	6
11	Prognosis of high cholesterol level	negative	0.2289	13	6
12	Prognosis of high uric acid level	negative	0.1312	15	6
13	Prognosis of low ferritin level	negative	0.0119	1	7
14	Prognosis of high glucose level	negative	0.0081	14	7
15	Prognosis of high cholesterol level	negative	0.2290	13	7
16	Prognosis of high uric acid level	negative	0.1312	15	7
17	Prognosis of low ferritin level	positive	0.2048	1	8
18	Prognosis of high glucose level	negative	0.0110	14	8
19	Prognosis of high cholesterol level	negative	0.1924	13	8
20	Prognosis of high uric acid level	negative	0.0601	15	8
21	Prognosis of low ferritin level	negative	0.0119	1	9
22	Prognosis of high glucose level	negative	0.0081	14	9
23	Prognosis of high cholesterol level	negative	0.2290	13	9
24	Prognosis of high uric acid level	negative	0.1312	15	9
25	Prognosis of low ferritin level	positive	0.1707	1	10
26	Prognosis of high glucose level	negative	0.0113	14	10
27	Prognosis of high cholesterol level	negative	0.1983	13	10
28	Prognosis of high uric acid level	negative	0.0922	15	10
29	Prognosis of low ferritin level	negative	0.0342	1	11
30	Prognosis of high glucose level	negative	0.0105	14	11
31	Prognosis of high cholesterol level	negative	0.1152	13	11
32	Prognosis of high uric acid level	negative	0.1048	15	11
33	Prognosis of low ferritin level	positive	0.1707	1	12
34	Prognosis of high glucose level	negative	0.0113	14	12
35	Prognosis of high cholesterol level	negative	0.1983	13	12
36	Prognosis of high uric acid level	negative	0.0922	15	12
37	Prognosis of low ferritin level	negative	0.0251	1	13
38	Prognosis of high glucose level	negative	0.0061	14	13
39	Prognosis of high cholesterol level	negative	0.2796	13	13
40	Prognosis of high uric acid level	negative	0.0542	15	13
41	Prognosis of low ferritin level	negative	0.0251	1	14
42	Prognosis of high glucose level	negative	0.0061	14	14
43	Prognosis of high cholesterol level	negative	0.2796	13	14
44	Prognosis of high uric acid level	negative	0.0542	15	14
45	Prognosis of low ferritin level	positive	0.1707	1	15
46	Prognosis of high glucose level	negative	0.0113	14	15
47	Prognosis of high cholesterol level	negative	0.1983	13	15
48	Prognosis of high uric acid level	negative	0.0922	15	15
49	Prognosis of low ferritin level	negative	0.0119	1	16
50	Prognosis of high glucose level	negative	0.0081	14	16
51	Prognosis of high cholesterol level	negative	0.2289	13	16
52	Prognosis of high uric acid level	negative	0.1312	15	16
53	Prognosis of low ferritin level	positive	0.2048	1	17
54	Prognosis of high glucose level	negative	0.0110	14	17
55	Prognosis of high cholesterol level	negative	0.1924	13	17
56	Prognosis of high uric acid level	negative	0.0601	15	17
57	Prognosis of low ferritin level	positive	0.1580	1	18
58	Prognosis of low ferritin level	negative	0.0247	1	19
59	Prognosis of low ferritin level	negative	0.0247	1	20
60	Prognosis of low ferritin level	negative	0.0247	1	21
77	Prognosis of low ferritin level	negative	0.0247	1	26
78	Prognosis of high glucose level	negative	0.0048	14	26
79	Prognosis of high cholesterol level	positive	0.2946	13	26
80	Prognosis of high uric acid level	negative	0.1272	15	26
81	Prognosis of low ferritin level	negative	0.0247	1	27
82	Prognosis of high glucose level	negative	0.0048	14	27
83	Prognosis of high cholesterol level	positive	0.2946	13	27
84	Prognosis of high uric acid level	negative	0.1272	15	27
85	Prognosis of low ferritin level	negative	0.0247	1	28
86	Prognosis of high glucose level	negative	0.0048	14	28
87	Prognosis of high cholesterol level	positive	0.2946	13	28
88	Prognosis of high uric acid level	negative	0.1272	15	28
97	Prognosis of low ferritin level	negative	0.0247	1	31
98	Prognosis of high glucose level	negative	0.0048	14	31
99	Prognosis of high cholesterol level	positive	0.2946	13	31
100	Prognosis of high uric acid level	negative	0.1272	15	31
\.


--
-- Data for Name: predictions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.predictions (id, description, creation_date, sample_id, update_date) FROM stdin;
6	\N	2025-09-24 13:36:49.965721	4	\N
7	\N	2025-09-24 13:38:57.445348	10	\N
8	\N	2025-09-24 13:40:07.612342	7	\N
9	\N	2025-09-24 13:47:25.645964	10	\N
10	\N	2025-09-24 13:47:48.490812	8	\N
11	\N	2025-09-24 13:54:25.695117	3	\N
4	\N	2025-09-24 13:32:56.980215	1	2025-10-17 19:24:18.722265
5	\N	2025-09-24 13:34:05.839319	7	2025-10-17 19:26:21.686834
12	\N	2025-10-21 21:27:20.192489	8	2025-10-21 21:27:20.192493
13	\N	2025-10-21 22:14:34.300931	11	2025-10-21 22:14:34.300935
14	\N	2025-10-22 14:15:53.860057	11	2025-10-22 14:15:53.860062
15	\N	2025-11-06 19:49:31.490009	8	2025-11-06 19:49:31.490014
16	\N	2025-11-12 19:03:32.209252	4	2025-11-12 19:03:32.209256
17	\N	2025-11-12 19:04:04.088674	7	2025-11-12 19:04:04.088677
18	\N	2025-11-12 19:11:16.919836	1	2025-11-12 19:11:16.91984
19	\N	2025-11-12 19:33:28.847899	1	2025-11-12 19:33:28.847904
20	\N	2025-11-12 19:33:32.60842	1	2025-11-12 19:33:32.608426
21	\N	2025-11-12 19:33:34.400268	1	2025-11-12 19:33:34.400286
26	\N	2025-11-12 19:36:13.522099	3	2025-11-12 19:36:13.522106
27	\N	2025-11-12 19:37:36.95715	7	2025-11-12 19:37:36.957154
28	\N	2025-11-12 19:37:54.009382	3	2025-11-12 19:37:54.009387
31	\N	2025-11-12 19:39:01.385918	11	2025-11-12 19:39:01.385923
\.


--
-- Data for Name: request_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_statuses (id, name) FROM stdin;
1	Ожидание
2	Активный
3	Отклонено
4	Завершено
5	Отменено
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (id, creation_date, update_date, status_id, patient_id, doctor_id) FROM stdin;
74	2025-11-25 20:29:50.237568	2025-11-25 20:29:50.237572	1	1	7
75	2025-11-25 20:29:57.551268	2025-11-25 20:30:00.172134	5	1	5
33	2025-10-21 19:23:22.791953	2025-10-21 19:23:30.137835	5	1	3
35	2025-10-21 19:24:40.74185	2025-10-21 19:25:03.918497	5	1	4
34	2025-10-21 19:24:34.548166	2025-10-21 19:25:06.309559	5	1	3
37	2025-10-21 19:25:12.862385	2025-10-21 19:25:18.289878	5	1	4
36	2025-10-21 19:25:12.085201	2025-10-21 19:25:18.732706	5	1	3
39	2025-10-21 19:25:22.390796	2025-10-21 19:25:24.061024	5	1	4
38	2025-10-21 19:25:21.977957	2025-10-21 19:25:24.170515	5	1	3
40	2025-10-21 19:25:56.328319	2025-10-21 19:25:59.918307	5	1	3
72	2025-11-06 18:08:45.028223	2025-12-01 17:33:11.570331	2	7	16
73	2025-11-14 23:57:26.424906	2025-12-01 17:33:19.379485	2	1	16
76	2025-11-25 20:30:02.144382	2025-12-08 19:56:38.014796	5	1	5
77	2025-12-08 19:56:47.353851	2025-12-08 20:01:36.944282	5	1	5
65	2025-11-04 22:40:43.427621	2025-12-08 20:01:44.674507	4	1	4
47	2025-10-24 20:48:52.91924	2025-10-24 20:49:17.367828	5	1	5
48	2025-10-24 20:50:51.874194	2025-10-24 20:51:04.228606	5	1	5
32	2025-10-21 19:23:07.094716	2025-10-24 20:54:28.127142	4	1	3
49	2025-10-24 20:54:47.003465	2025-10-24 20:54:51.853285	5	1	5
50	2025-10-24 20:55:32.744396	2025-10-24 21:14:06.178081	5	1	3
44	2025-10-22 20:22:53.479533	2025-10-24 21:14:44.445998	4	1	10
51	2025-10-24 21:15:09.921497	2025-10-24 21:15:19.428106	5	1	3
41	2025-10-21 19:26:12.992376	2025-10-24 21:15:48.318096	4	1	3
42	2025-10-22 13:34:19.887064	2025-10-24 21:47:04.928483	4	1	3
52	2025-10-24 22:47:09.959654	2025-10-24 23:29:26.69424	5	1	3
53	2025-10-24 23:30:57.889934	2025-10-24 23:36:10.72957	5	1	3
43	2025-10-22 20:18:50.364793	2025-11-04 19:01:05.011967	5	1	16
55	2025-11-04 19:01:07.26498	2025-11-04 19:01:09.927664	5	1	16
56	2025-11-04 19:01:11.384002	2025-11-04 19:09:33.755302	5	1	16
58	2025-11-04 19:09:39.291801	2025-11-04 19:09:40.764302	5	1	16
59	2025-11-04 19:09:44.545399	2025-11-04 19:09:46.139041	5	1	16
57	2025-11-04 19:01:18.212018	2025-11-04 19:09:48.251159	5	1	4
60	2025-11-04 19:09:49.93974	2025-11-04 19:09:51.343354	5	1	9
61	2025-11-04 19:09:52.147764	2025-11-04 19:09:59.394479	5	1	9
62	2025-11-04 19:10:08.163343	2025-11-04 19:10:10.398349	5	1	16
64	2025-11-04 19:40:17.338727	2025-11-04 22:40:09.681086	5	1	9
67	2025-11-04 23:52:27.782806	2025-11-04 23:52:27.78281	1	5	16
68	2025-11-04 23:52:54.629567	2025-11-04 23:52:54.629571	1	6	16
63	2025-11-04 19:10:12.275723	2025-11-05 19:15:30.295407	5	1	16
66	2025-11-04 23:51:38.477346	2025-11-06 13:13:58.988579	3	4	16
69	2025-11-04 23:53:16.114998	2025-11-06 13:14:26.464952	4	7	16
70	2025-11-05 19:15:52.359948	2025-11-06 17:48:53.242944	4	1	16
71	2025-11-06 17:49:02.70214	2025-11-14 22:18:18.721032	4	1	16
46	2025-10-24 20:34:48.89158	2025-10-24 20:34:48.891585	2	1	10
54	2025-10-24 23:36:19.638804	2025-10-24 23:36:19.638808	2	1	3
45	2025-10-22 20:23:03.436875	2025-11-25 20:29:30.406176	5	1	8
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	Пациент
2	Врач
3	Администратор
\.


--
-- Data for Name: sample_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sample_results (id, value, analyte_id, sample_id) FROM stdin;
1	21.90	7	1
2	22.00	8	1
3	80.10	9	1
4	3.20	10	1
5	100.00	11	1
6	130.00	12	1
7	14.20	13	1
8	5.76	14	1
9	0.30	15	1
10	35.20	16	1
11	132.00	17	1
12	7.50	18	1
13	82.00	19	1
14	6.10	20	1
15	230.50	21	1
16	63.00	22	1
17	30.00	23	1
18	2.50	24	1
19	0.50	25	1
20	4.00	26	1
21	2.80	27	1
22	600.00	1	2
23	300.00	2	2
24	8.50	3	2
25	1200.00	4	2
26	1300.00	5	2
27	2.50	6	2
28	15.90	7	2
29	18.90	8	2
30	90.00	9	2
31	5.20	10	2
32	75.00	11	2
33	300.36	12	2
34	4.20	13	2
35	5.83	14	2
36	0.42	15	2
37	56.00	16	2
38	170.00	17	2
39	4.50	18	2
40	82.00	19	2
41	6.10	20	2
42	230.50	21	2
43	62.00	22	2
44	30.00	23	2
45	2.50	24	2
46	1.50	25	2
47	4.00	26	2
48	3.00	27	2
49	1200.00	4	3
50	15.20	5	3
51	132.00	17	3
52	4.50	18	3
53	82.00	19	3
54	6.10	20	3
55	230.50	21	3
56	63.00	22	3
57	30.00	23	3
58	2.50	24	3
59	0.50	25	3
60	4.00	26	3
61	1001.30	2	4
62	60.00	3	4
63	132.00	17	4
64	4.50	18	4
65	100.00	19	4
66	6.10	20	4
67	230.50	21	4
68	63.00	22	4
69	30.00	23	4
70	2.50	24	4
71	0.50	25	4
72	4.00	26	4
73	500.20	1	5
74	4.80	13	5
75	4.16	14	5
76	0.37	15	5
77	45.20	16	5
78	165.00	17	5
79	4.50	18	5
80	82.00	19	5
81	6.10	20	5
82	230.50	21	5
83	63.00	22	5
84	30.00	23	5
85	2.50	24	5
86	0.50	25	5
87	4.00	26	5
88	25.00	27	5
101	82.00	19	7
103	230.50	21	7
104	60.00	22	7
105	30.00	23	7
106	5.50	24	7
107	0.50	25	7
108	4.00	26	7
141	60.00	3	11
142	132.00	17	11
143	4.50	18	11
144	100.00	19	11
145	6.10	20	11
146	230.50	21	11
100	5.60	18	7
102	6.10	20	7
99	135.00	17	7
109	140.00	17	8
110	5.60	18	8
111	82.00	19	8
112	6.10	20	8
113	230.50	21	8
114	60.00	22	8
115	30.00	23	8
116	5.50	24	8
117	0.50	25	8
118	4.00	26	8
129	1001.30	2	10
130	60.00	3	10
131	132.00	17	10
132	4.50	18	10
133	100.00	19	10
134	6.10	20	10
135	230.60	21	10
136	63.00	22	10
137	30.00	23	10
138	2.50	24	10
139	0.50	25	10
140	4.00	26	10
147	63.00	22	11
148	30.00	23	11
149	2.50	24	11
150	0.50	25	11
151	4.00	26	11
152	600.00	1	12
153	300.00	2	12
154	8.50	3	12
155	90.00	9	12
156	5.20	10	12
157	75.00	11	12
158	300.36	12	12
159	4.20	13	12
160	5.83	14	12
161	0.42	15	12
162	56.00	16	12
163	170.00	17	12
164	4.50	18	12
165	82.00	19	12
166	6.10	20	12
167	230.50	21	12
168	62.00	22	12
169	30.00	23	12
170	2.50	24	12
171	1.50	25	12
172	4.00	26	12
173	3.00	27	12
174	170.00	17	13
175	1.00	18	13
176	120.00	19	13
177	1.00	20	13
178	1.00	21	13
179	5.00	22	13
180	30.00	23	13
181	30.00	24	13
182	5.00	25	13
183	30.00	26	13
184	1200.00	4	14
185	15.20	5	14
186	132.00	17	14
187	4.50	18	14
188	82.00	19	14
189	6.10	20	14
190	230.50	21	14
191	63.00	22	14
192	30.00	23	14
193	2.50	24	14
194	0.50	25	14
195	4.00	26	14
196	1200.00	4	15
197	15.20	5	15
198	132.00	17	15
199	4.50	18	15
200	82.00	19	15
201	6.10	20	15
202	230.50	21	15
203	63.00	22	15
204	30.00	23	15
205	2.50	24	15
206	0.50	25	15
207	4.00	26	15
208	1500.00	4	16
209	15.20	5	16
210	132.00	17	16
211	4.50	18	16
212	82.00	19	16
213	6.10	20	16
214	230.50	21	16
215	63.00	22	16
216	30.00	23	16
217	2.50	24	16
218	0.50	25	16
219	4.00	26	16
220	1400.00	4	17
221	15.20	5	17
222	132.00	17	17
223	4.50	18	17
224	82.00	19	17
225	6.10	20	17
226	230.50	21	17
227	63.00	22	17
228	30.00	23	17
229	2.50	24	17
230	0.50	25	17
231	4.00	26	17
242	0.50	25	18
243	4.00	26	18
239	60.00	22	18
241	5.50	24	18
235	5.40	18	18
236	83.00	19	18
234	150.00	17	18
258	50.00	16	18
260	11.00	6	18
261	10.00	9	18
259	10.00	5	18
262	180.00	17	20
263	4.20	18	20
264	120.00	19	20
265	1.20	20	20
266	45.00	21	20
267	20.00	22	20
268	30.00	23	20
238	231.50	21	18
269	10.00	24	20
270	10.00	25	20
240	31.00	23	18
271	30.00	26	20
283	180.00	17	22
284	5.40	18	22
285	130.00	19	22
286	1.20	20	22
287	120.20	21	22
288	30.00	22	22
289	20.00	23	22
290	15.00	24	22
291	20.00	25	22
292	15.00	26	22
237	6.10	20	18
\.


--
-- Data for Name: samples; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.samples (id, upload_date, update_date, patient_id) FROM stdin;
1	2025-09-12 17:13:23.127205	2025-09-12 17:13:23.127209	1
2	2025-09-12 17:13:42.325542	2025-09-12 17:13:42.325546	1
3	2025-09-12 17:13:50.749294	2025-09-12 17:13:50.749298	1
4	2025-09-12 17:13:58.862363	2025-09-12 17:13:58.862366	1
5	2025-09-12 17:14:08.779126	2025-09-12 17:14:08.779129	1
7	2025-09-12 17:28:40.619121	2025-09-20 12:23:32.335633	1
8	2025-09-23 21:20:06.299403	2025-09-23 21:20:06.299408	1
10	2025-09-23 21:26:37.323205	2025-09-23 21:26:37.323209	1
11	2025-09-29 18:26:46.416571	2025-09-29 18:26:46.416576	1
12	2025-09-29 18:31:24.438562	2025-09-29 18:31:24.438565	1
13	2025-11-14 14:59:22.939607	2025-11-14 14:59:22.939611	1
14	2025-11-15 18:02:27.511121	2025-11-15 18:02:27.511129	1
15	2025-11-15 18:03:33.798503	2025-11-15 18:03:33.798509	1
16	2025-11-15 18:03:54.60233	2025-11-15 18:03:54.602334	1
17	2025-11-15 18:05:13.393088	2025-11-15 18:05:13.393092	1
18	2025-11-15 18:05:28.514733	2025-11-24 18:59:50.062367	1
20	2025-11-25 23:29:04.671271	2025-11-25 23:29:04.671275	1
22	2025-12-08 19:44:55.046175	2025-12-08 19:44:55.04618	1
\.


--
-- Data for Name: statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statuses (id, name) FROM stdin;
1	Активный
2	Удален
3	Заблокирован
4	На модерации
\.


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokens (id, refresh_token, user_id) FROM stdin;
12	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoiZHIudGVyZWtob3ZhQGludml0cm8ub3JnIiwiaXNfYWN0aXZhdGVkIjpmYWxzZSwicm9sZSI6Ilx1MDQxMlx1MDQ0MFx1MDQzMFx1MDQ0NyIsImlhdCI6MTc2MDk2MDE0NiwiZXhwIjoxNzYzNTUyMTQ2fQ.lrxMI540kccaQ0uDvaf1weg2VirrLRaMcTem9D2RbQI	12
28	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImVtYWlsIjoiYS5sb3NrdXRvdjk3QG1haWwucnUiLCJpc19hY3RpdmF0ZWQiOmZhbHNlLCJyb2xlIjoiXHUwNDFmXHUwNDMwXHUwNDQ2XHUwNDM4XHUwNDM1XHUwNDNkXHUwNDQyIiwiaWF0IjoxNzYyMjg5NDcwLCJleHAiOjE3NjQ4ODE0NzB9.hN1SrdUMGX4lZ-gpevLkL1A3Lq430uNnJvvkNsbqVb4	21
29	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsImVtYWlsIjoiYW5uYS5tYXl1a0BpbmJveC5ydSIsImlzX2FjdGl2YXRlZCI6ZmFsc2UsInJvbGUiOiJcdTA0MWZcdTA0MzBcdTA0NDZcdTA0MzhcdTA0MzVcdTA0M2RcdTA0NDIiLCJpYXQiOjE3NjIyODk1MzUsImV4cCI6MTc2NDg4MTUzNX0.3UKANL8ZUR1dK6V0iLXFndk85AaWorIeGKVx9qGOqog	22
6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJtZWxuaWtvdmEubWRAY2xpbmljLnJ1IiwiaXNfYWN0aXZhdGVkIjpmYWxzZSwicm9sZSI6Ilx1MDQxMlx1MDQ0MFx1MDQzMFx1MDQ0NyIsImlhdCI6MTc1ODkxNzU0NSwiZXhwIjoxNzYxNTA5NTQ1fQ.kevFaX1xSrOxVHEvdIad0NtcDLs5Vi287eHCjZLwY5w	6
7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJib2dkYW5vdmEubWRAY2xpbmljLnJ1IiwiaXNfYWN0aXZhdGVkIjpmYWxzZSwicm9sZSI6Ilx1MDQxMlx1MDQ0MFx1MDQzMFx1MDQ0NyIsImlhdCI6MTc1ODkxNzY0MCwiZXhwIjoxNzYxNTA5NjQwfQ.NiQIGIk13F-xE_0PiYJ5yCO_I2bNj4sYKIStH3HzxNc	7
8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJhbW9yb3oxOTczQGdtYWlsLmNvbSIsImlzX2FjdGl2YXRlZCI6ZmFsc2UsInJvbGUiOiJcdTA0MTJcdTA0NDBcdTA0MzBcdTA0NDciLCJpYXQiOjE3NTg5MTc2NjQsImV4cCI6MTc2MTUwOTY2NH0.k1YJobQw5lUqjl1DucoSSxpRGAu19KUDSBdqVZYExfo	8
9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJvbGdhX2ZlZG9zaW1vdmFAbWFpbC5ydSIsImlzX2FjdGl2YXRlZCI6ZmFsc2UsInJvbGUiOiJcdTA0MTJcdTA0NDBcdTA0MzBcdTA0NDciLCJpYXQiOjE3NTg5MTc2OTksImV4cCI6MTc2MTUwOTY5OX0.7G2iY81rmYe6yLzYx3aCIIVAVVa4-4rj8Tbv7kt3L6U	9
10	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoic2tvcC50YXR5YW5hQG5ibWVkaWNhLnJ1IiwiaXNfYWN0aXZhdGVkIjpmYWxzZSwicm9sZSI6Ilx1MDQxMlx1MDQ0MFx1MDQzMFx1MDQ0NyIsImlhdCI6MTc1ODkxNzcyOCwiZXhwIjoxNzYxNTA5NzI4fQ.1-8skCvheOXjlPu9v_HHLvbK342QzZ0l26bOeV_k_iY	10
11	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoic21pdHJvc2hpbmFAbWFpbC5ydSIsImlzX2FjdGl2YXRlZCI6ZmFsc2UsInJvbGUiOiJcdTA0MTJcdTA0NDBcdTA0MzBcdTA0NDciLCJpYXQiOjE3NTg5MTc3NTIsImV4cCI6MTc2MTUwOTc1Mn0.Qwq-XO9vZHzDUc3zGU_oXexIiqB16Pv7R_HWf-9vHPY	11
13	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoicHNvcm9rYUBpbnZpdHJvLm9yZyIsImlzX2FjdGl2YXRlZCI6ZmFsc2UsInJvbGUiOiJcdTA0MTJcdTA0NDBcdTA0MzBcdTA0NDciLCJpYXQiOjE3NTg5MTc4MDgsImV4cCI6MTc2MTUwOTgwOH0.3zV7d0Xi-SLqtvD2qjX4M2AVgHAb6luAtrFGrZJDPpk	13
31	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsImVtYWlsIjoic2lnYS1zdmV0bGFuYUB5YW5kZXgucnUiLCJpc19hY3RpdmF0ZWQiOmZhbHNlLCJyb2xlIjoiXHUwNDFmXHUwNDMwXHUwNDQ2XHUwNDM4XHUwNDM1XHUwNDNkXHUwNDQyIiwiaWF0IjoxNzYyNDI5OTg5LCJleHAiOjE3NjUwMjE5ODl9.6mBUuoR85iVHESm6UqBBNvsy56EiaT8B7_Oj6pLcNYE	24
26	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJwZXRuYXQyMDA4QHlhbmRleC5ydSIsImlzX2FjdGl2YXRlZCI6ZmFsc2UsInJvbGUiOiJcdTA0MTBcdTA0MzRcdTA0M2NcdTA0MzhcdTA0M2RcdTA0MzhcdTA0NDFcdTA0NDJcdTA0NDBcdTA0MzBcdTA0NDJcdTA0M2VcdTA0NDAiLCJpYXQiOjE3NjY0OTYzODQsImV4cCI6MTc2OTA4ODM4NH0.vmgVdffF1VCKijhLKDbHpay8zyF5ohZ1HunMyYmXHvY	3
5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJ6YWJvdGFAbGFudGEyNy5ydSIsImlzX2FjdGl2YXRlZCI6ZmFsc2UsInJvbGUiOiJcdTA0MTJcdTA0NDBcdTA0MzBcdTA0NDciLCJpYXQiOjE3NjY0OTYzODksImV4cCI6MTc2OTA4ODM4OX0.dOsFMy2b8cCzsU6n5_Qa8zL0qBYbWPT-g5Ov8QcaPZc	5
57	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImVtYWlsIjoiYWFsaWV2YUBsYW50YTI3LnJ1IiwiaXNfYWN0aXZhdGVkIjpmYWxzZSwicm9sZSI6Ilx1MDQxMlx1MDQ0MFx1MDQzMFx1MDQ0NyIsImlhdCI6MTc3MTg2NzMyNCwiZXhwIjoxNzc0NDU5MzI0fQ.z49v2R1yBLYu-8v7c19okDJBdZs9Mvjc4MxSd4ocvLM	18
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, activation_link, is_activated, registration_date, last_name, first_name, middle_name, birth_date, gender_id, city, phone, photo, status_id, role_id, icon) FROM stdin;
11	smitroshina@mail.ru	$2b$12$.vzHxs73sLaTyKJVx22/S.SQPKNygZ1onGJc4Y94vT71e5g5o0OBy	http://localhost:5000/auth/activate/097ad2c1c2714b8f81e0182e155f9b3c	f	2025-09-24 15:23:43.85032	Митрошина	Светлана	Александровна	1961-11-05	2	Москва	+7 (495) 150-16-56	ab239a70b77e421a9f52363584da4dfd.jpg	4	2	d2a55ea3242d425c95a42fd6b1b6adef.png
12	dr.terekhova@invitro.org	$2b$12$04Z2UGw3C6oduOhryGU7xOWAwLr/HpYGF0NROWEmQBiabBzC63jl2	http://localhost:5000/auth/activate/e07a8bccbf3c4cceab63c8fd658fa244	f	2025-09-24 15:23:50.95776	Терехова	Анастасия	Олеговна	2003-05-07	2	Москва	+7 (495) 646-13-02	aa4274e15ec045e09265c55f57730e35.png	4	2	7e996c836f42495681b3bd941827d5ed.png
13	psoroka@invitro.org	$2b$12$iMlbEZS4ONr.7ITLZxXh../j24405Ovp3XhpE4IolqUH/8PmC/vnm	http://localhost:5000/auth/activate/d487eb80509146e4bf92a59e07e2e61a	f	2025-09-24 15:24:02.623731	Сорока	Петр	Викторович	1974-06-25	1	Москва	+7 (495) 150-16-56	46e20848e36f4336bbaca19f51e49a93.jpg	4	2	29e64f301edb44f0859e8ce34aac427c.png
6	melnikova.md@clinic.ru	$2b$12$TGBrPBWkZ.GZYvM62EUK9.qlxE7FN8WVR26t21pQ6.icg8CUy9mUi	http://localhost:5000/auth/activate/8952831ad76d428abe42dbc01defd14d	f	2025-09-24 15:22:55.533577	Мельникова	Ксения	Михайловна	1981-05-11	2	Москва	+7 (495) 646-13-02	95c00d479ddc4850a67776a817fd5188.png	4	2	fd1a02d6930841f9802748908633cb18.png
5	zabota@lanta27.ru	$2b$12$CI15MXu6x/C2CZYlNyJ0rua/Q9k50OnDlR3Bv8t2jfu6tsTeJaTMe	http://localhost:5000/auth/activate/5d15cca9339441969b9f9566cae746ab	f	2025-09-24 15:22:20.723988	Сухинина	Виктория	Владимировна	1998-07-21	2	Хабаровск	+7 (4212) 46-18-00	52c3835f1edc4d6b9ac6055a80200093.jpg	4	2	fb40c97853a1425d96ba25ce5267fdc6.png
7	bogdanova.md@clinic.ru	$2b$12$gaW0nWiYAkXsRcsWAHeIGOYdqiz331eSWJMjG8gbBp0Og2rIH3Hqe	http://localhost:5000/auth/activate/455b91169ce64392b3a7ce1ab637771b	f	2025-09-24 15:23:05.710503	Богданова	Татьяна	Олеговна	1979-12-23	2	Самара	+7 (846) 372-0036	4490253e90004ce2a37a23bd6617b986.png	4	2	a2c30c35d7fc437d9f1985b47d0250f0.png
8	amoroz1973@gmail.com	$2b$12$ZkmrY3iMmcr/jSMcSW1bO.y1v09tCdBM3UHcoI6JEWtSX5UvXIbPu	http://localhost:5000/auth/activate/c4b539b8f56644ea929494991f07177f	f	2025-09-24 15:23:17.138899	Морозова	Александра	Михайловна	1973-02-27	2	Самара	+7 (846) 211-83-42	1727ba90b0ed46b194899093da54abf9.png	4	2	8229896c4c0745b4a879e59d06423407.png
9	olga_fedosimova@mail.ru	$2b$12$a68BIJqutWy.YqYOaxXkUeGtZAQ/Mg1RFIqoIDUJEcdl0vFp/jNl.	http://localhost:5000/auth/activate/e99394b1fae74400a55084a320777af0	f	2025-09-24 15:23:26.862109	Федосимова	Ольга	Владимировна	1980-01-14	2	Самара	+7 (846) 211-83-42	7773af9c1cb54e05b5f8ee659fad190f.jpg	4	2	6000268555bb4082b37263522844bd7b.png
10	skop.tatyana@nbmedica.ru	$2b$12$1MuX8ND2lDmY393KMEBlF.GC/qxq7VJAbfBfCa4AiSsfdwvAFMJO.	http://localhost:5000/auth/activate/44802ec23f8444a9ad02e7cff41ee644	f	2025-09-24 15:23:36.08789	Скоп	Татьяна	Михайловна	1995-04-26	2	Москва	+7 (495) 150-16-56	e0a6213c7e594a47b2ed2a4ff60d0acb.jpg	4	2	67d04bf9b8464749b92a883c44722af4.png
22	anna.mayuk@inbox.ru	$2b$12$6zIB/UE3nwUQf3508ivupe2Xe1Vkn99p17gTsLxZ6UBN4lq87gQi6	http://localhost:5000/auth/activate/9982547f862b48b39fcaa84ab739a146	f	2025-11-04 23:21:25.806112	Маюк	Анна	Александровна	2000-03-07	2	Екатеринбург	+7 (917) 307-03-00	4e7559f435d34f60bae94b25211a1932.png	1	1	4ec5647a4301431ca76b52c57af2d45d.png
1	petilia2002@yandex.ru	$2b$12$TV4DuzLqaYal7sU.uJJu5exx8eCcDgEvdwlJ98gmU9k/mXKxfkeIe	http://localhost:5000/auth/activate/adeb3f2fa1d842abbe856eba3c6d1f77	f	2025-09-12 17:09:07.320306	Петренков	Илья	Алексеевич	2002-04-27	1	Самара	+7 (927) 723-48-35	32cec862f440495f9f3dd2387d4bbbb3.jpg	1	1	c1be96d04f9e49f8854c79a16f0c25fc.png
23	dasha.proskuryakova@gmail.com	$2b$12$Uc7Uz.1d5gAXb7Lz1jqqmOqayOn4TLAEMFjZFMdHWUyPnzLiLJzQK	http://localhost:5000/auth/activate/d5235326ddeb4db0bdd83a2185204a8a	f	2025-11-04 23:21:37.415491	Пронина	Дарья	Александровна	2003-07-12	2	Краснодар	+7 (925) 712-07-03	b76473319667426fa496e145854224af.jpg	1	1	9a1b58244acf4602b46140cc1dec3b9c.png
18	aalieva@lanta27.ru	$2b$12$a96rFVKHeuxL0qYJ13F8vuD65cr.r9INuiqM8VB95kdVYInD052Ha	http://localhost:5000/auth/activate/a6e946e524ef4a779aa53f50697b4fc2	f	2025-09-24 23:48:28.75076	Алиева	Алиса	Валерьевна	2000-03-04	2	Хабаровск	+7 (4212) 46-18-00	337d53cce40c41e882681a2874f956d3.jpg	4	2	67dcb169e68b4faa962b891bd432a2eb.png
21	a.loskutov97@mail.ru	$2b$12$ZsIn7j1FM4NPgr3ik4XwQeAO3gvloOiOvrlFAAM8TPuERpD1CYbQ6	http://localhost:5000/auth/activate/f92a673d1efd4b37a57c4eb245fda5d5	f	2025-11-04 23:20:47.504022	Лоскутов	Антон	Алексеевич	1997-01-14	1	Новосибирск	+7 (914) 597-14-97	ad7fbca29585465abcf454e00b09016d.jpg	1	1	3c8f0d70035f4ec7b3ff5e5c940e22bd.png
24	siga-svetlana@yandex.ru	$2b$12$OOqTEN0hSROb5OL/UjEequYV4FGDsPDvm5ZScFNxmZP2GKYJHeHeW	http://localhost:5000/auth/activate/6ee6d4cdd4c34822a30353a92a994f5c	f	2025-11-04 23:21:47.607818	Сигалова	Светлана	Владимировна	1981-05-19	2	Москва	+7 (916) 519-05-81	9830edee41b14bf8827bbd5f5281b67f.jpg	1	1	3f70234f96084749a332dcea5166d69d.png
3	petnat2008@yandex.ru	$2b$12$UonoDXfdGi48MQgXnUvdweU6gqfVm9uACbgb9I6JdYOQYO4iYWg9y	http://localhost:5000/auth/activate/dbe86235077f4d68b86fe0dcdb8cd9fe	f	2025-09-12 17:09:24.725133	Петренкова	Наталья	Геннадьевна	1979-03-06	2	Самара	+7 (927) 710-12-25	\N	1	3	\N
25	carpovpv@gmail.com	$2b$12$9BG/VVjlm/WmkVsueaOutOjtYIvlIjz3W.nee6cN1YpvKx5gBWzuO	http://localhost:5000/auth/activate/353f263f9ef44fe0966c3388b94c9936	f	2026-02-23 16:51:40.31742	Карпов	Павел	Владимирович	1988-02-22	1	\N	\N	\N	1	1	\N
\.


--
-- Name: access_predictions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.access_predictions_id_seq', 29, true);


--
-- Name: analytes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analytes_id_seq', 1, false);


--
-- Name: doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctors_id_seq', 16, true);


--
-- Name: expertise_areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expertise_areas_id_seq', 1, false);


--
-- Name: genders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genders_id_seq', 1, false);


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 8, true);


--
-- Name: prediction_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prediction_results_id_seq', 132, true);


--
-- Name: predictions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.predictions_id_seq', 39, true);


--
-- Name: request_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_statuses_id_seq', 1, false);


--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requests_id_seq', 77, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: sample_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sample_results_id_seq', 292, true);


--
-- Name: samples_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.samples_id_seq', 22, true);


--
-- Name: statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.statuses_id_seq', 1, false);


--
-- Name: tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokens_id_seq', 57, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 25, true);


--
-- Name: access_predictions access_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_predictions
    ADD CONSTRAINT access_predictions_pkey PRIMARY KEY (id);


--
-- Name: analytes analytes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytes
    ADD CONSTRAINT analytes_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_user_id_key UNIQUE (user_id);


--
-- Name: expertise_areas expertise_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expertise_areas
    ADD CONSTRAINT expertise_areas_pkey PRIMARY KEY (id);


--
-- Name: genders genders_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genders
    ADD CONSTRAINT genders_name_key UNIQUE (name);


--
-- Name: genders genders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genders
    ADD CONSTRAINT genders_pkey PRIMARY KEY (id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: patients patients_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_user_id_key UNIQUE (user_id);


--
-- Name: prediction_results prediction_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prediction_results
    ADD CONSTRAINT prediction_results_pkey PRIMARY KEY (id);


--
-- Name: predictions predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predictions
    ADD CONSTRAINT predictions_pkey PRIMARY KEY (id);


--
-- Name: request_statuses request_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_statuses
    ADD CONSTRAINT request_statuses_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sample_results sample_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_results
    ADD CONSTRAINT sample_results_pkey PRIMARY KEY (id);


--
-- Name: samples samples_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.samples
    ADD CONSTRAINT samples_pkey PRIMARY KEY (id);


--
-- Name: statuses statuses_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_name_key UNIQUE (name);


--
-- Name: statuses statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_pkey PRIMARY KEY (id);


--
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id);


--
-- Name: tokens tokens_refresh_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_refresh_token_key UNIQUE (refresh_token);


--
-- Name: tokens tokens_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_user_id_key UNIQUE (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: access_predictions access_predictions_prediction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_predictions
    ADD CONSTRAINT access_predictions_prediction_id_fkey FOREIGN KEY (prediction_id) REFERENCES public.predictions(id) ON DELETE CASCADE;


--
-- Name: access_predictions access_predictions_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_predictions
    ADD CONSTRAINT access_predictions_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;


--
-- Name: doctors doctors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: expertise_areas expertise_areas_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expertise_areas
    ADD CONSTRAINT expertise_areas_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: patients patients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: prediction_results prediction_results_analyte_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prediction_results
    ADD CONSTRAINT prediction_results_analyte_id_fkey FOREIGN KEY (analyte_id) REFERENCES public.analytes(id) ON DELETE CASCADE;


--
-- Name: prediction_results prediction_results_prediction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prediction_results
    ADD CONSTRAINT prediction_results_prediction_id_fkey FOREIGN KEY (prediction_id) REFERENCES public.predictions(id) ON DELETE CASCADE;


--
-- Name: predictions predictions_sample_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predictions
    ADD CONSTRAINT predictions_sample_id_fkey FOREIGN KEY (sample_id) REFERENCES public.samples(id) ON DELETE CASCADE;


--
-- Name: requests requests_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: requests requests_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: requests requests_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.request_statuses(id) ON DELETE CASCADE;


--
-- Name: sample_results sample_results_analyte_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_results
    ADD CONSTRAINT sample_results_analyte_id_fkey FOREIGN KEY (analyte_id) REFERENCES public.analytes(id) ON DELETE CASCADE;


--
-- Name: sample_results sample_results_sample_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample_results
    ADD CONSTRAINT sample_results_sample_id_fkey FOREIGN KEY (sample_id) REFERENCES public.samples(id) ON DELETE CASCADE;


--
-- Name: samples samples_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.samples
    ADD CONSTRAINT samples_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: tokens tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_gender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_gender_id_fkey FOREIGN KEY (gender_id) REFERENCES public.genders(id) ON DELETE CASCADE;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: users users_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.statuses(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

