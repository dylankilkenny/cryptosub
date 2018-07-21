import sys
sys.path.append('../')
from bigramfreq import BigramFreq
from mockdf import MockDF

comments = MockDF()
posts = MockDF()
bigram_freq = BigramFreq(comments.getDataframe(), posts.getDataframe())  

def test_bigram_freq():
    bf = bigram_freq.getBigramFreq(None)
    assert isinstance(bf, list)
    assert len(bf) <= 500
    assert len(bf) > 0
    assert "bigram" in bf[0]
    assert "n_comment" in bf[0]
    assert "n_post" in bf[0]
    assert "n" in bf[0]

def test_bigram_freq_with_old():
    bf = bigram_freq.getBigramFreq(bigram_freq.getBigramFreq(None))
    assert isinstance(bf, list)
    assert len(bf) <= 500
    assert len(bf) > 0
    assert "bigram" in bf[0]
    assert "n_comment" in bf[0]
    assert "n_post" in bf[0]
    assert "n" in bf[0]
    

def test_bigram_freq_by_day():
    bf = bigram_freq.getBigramFreqByDay(None)
    print(bf)
    assert isinstance(bf, list)
    assert len(bf) <= 500
    assert len(bf) > 0
    assert "Date" in bf[0]
    assert "counts" in bf[0]
    assert "bigram" in bf[0]["counts"][0]
    assert "n" in bf[0]["counts"][0]
    assert len(bf[0]["counts"][0]) < 25
    

def test_bigram_freq_by_day_with_old():
    old = bigram_freq.getBigramFreqByDay(None)
    bf = bigram_freq.getBigramFreqByDay(old)
    assert isinstance(bf, list)
    assert len(bf) <= 500
    assert len(bf) > 0
    assert "Date" in bf[0]
    assert "counts" in bf[0]
    assert "bigram" in bf[0]["counts"][0]
    assert "n" in bf[0]["counts"][0]
    assert len(bf[0]["counts"][0]) < 25
