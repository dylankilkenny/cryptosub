import sys
sys.path.append('../')
from wordfreq import WordFreq
from mockdf import MockDF

comments = MockDF()
posts = MockDF()
word_freq = WordFreq(comments.getDataframe(), posts.getDataframe())  

def test_word_freq():
    wf = word_freq.get_word_freq(None)
    assert isinstance(wf, list)
    assert len(wf) <= 500
    assert len(wf) > 0
    assert "word" in wf[0]
    assert "n_comment" in wf[0]
    assert "n_post" in wf[0]
    assert "n" in wf[0]

def test_word_freq_with_old():
    wf = word_freq.get_word_freq(word_freq.get_word_freq(None))
    assert isinstance(wf, list)
    assert len(wf) <= 500
    assert len(wf) > 0
    assert "word" in wf[0]
    assert "n_comment" in wf[0]
    assert "n_post" in wf[0]
    assert "n" in wf[0]
    

def test_word_freq_by_day():
    wf = word_freq.get_word_freq_by_day(None)
    assert isinstance(wf, list)
    assert len(wf) <= 500
    assert len(wf) > 0
    assert "Date" in wf[0]
    assert "counts" in wf[0]
    assert "word" in wf[0]["counts"][0]
    assert "n" in wf[0]["counts"][0]
    assert len(wf[0]["counts"][0]) < 25
    

def test_word_freq_by_day_with_old():
    wf = word_freq.get_word_freq_by_day(word_freq.get_word_freq_by_day(None))
    assert isinstance(wf, list)
    assert len(wf) <= 500
    assert len(wf) > 0
    assert "Date" in wf[0]
    assert "counts" in wf[0]
    assert "word" in wf[0]["counts"][0]
    assert "n" in wf[0]["counts"][0]
    assert len(wf[0]["counts"][0]) < 25
    